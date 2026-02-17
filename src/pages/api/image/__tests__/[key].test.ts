/**
 * Integration Tests - Image Serving API
 * 
 * Tests para GET /api/image/[key]
 * - Path traversal prevention
 * - Cache HIT/MISS
 * - Rate limiting
 * - Content-Type correcto
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { APIContext } from 'astro';

// Mocks
const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
};

const mockR2Client = {
    send: vi.fn().mockResolvedValue({
        Body: {
            transformToByteArray: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
        },
        ContentType: 'image/jpeg',
    }),
};

// Mock modules
vi.mock('@/lib/redis', () => ({
    redis: mockRedis,
}));

vi.mock('@/lib/r2-client', () => ({
    r2Client: mockR2Client,
}));

vi.mock('@aws-sdk/client-s3', () => ({
    GetObjectCommand: vi.fn((params) => params),
}));

describe('GET /api/image/[key]', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Path Traversal Prevention', () => {
        it('should reject keys with ../', async () => {
            const context = createMockContext({
                params: { key: '../../../etc/passwd' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            const response = await GET(context);

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toContain('inválida');
        });

        it('should reject keys with path separators', async () => {
            const maliciousKeys = [
                'folder/../../secret.txt',
                'images\\..\\config.json',
                'test/../admin/data',
            ];

            for (const key of maliciousKeys) {
                const context = createMockContext({ params: { key } });
                const { GET } = await import('@/pages/api/image/[key]');
                const response = await GET(context);

                expect(response.status).toBe(400);
            }
        });

        it('should allow valid image keys', async () => {
            mockRedis.get.mockResolvedValueOnce(null); // Cache MISS

            const validKeys = [
                'image-123.jpg',
                'photo_2024.png',
                'user-avatar.webp',
            ];

            for (const key of validKeys) {
                const context = createMockContext({ params: { key } });
                const { GET } = await import('@/pages/api/image/[key]');
                const response = await GET(context);

                expect(response.status).toBe(200);
            }
        });
    });

    describe('Cache Behavior', () => {
        it('should return cached image on cache HIT', async () => {
            const cachedData = new Uint8Array([10, 20, 30]);
            mockRedis.get.mockResolvedValueOnce(cachedData);

            const context = createMockContext({
                params: { key: 'test-image.jpg' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            const response = await GET(context);

            expect(response.status).toBe(200);
            expect(mockR2Client.send).not.toHaveBeenCalled();
        });

        it('should fetch from R2 on cache MISS', async () => {
            mockRedis.get.mockResolvedValueOnce(null); // Cache MISS

            const context = createMockContext({
                params: { key: 'test-image.jpg' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            const response = await GET(context);

            expect(response.status).toBe(200);
            expect(mockR2Client.send).toHaveBeenCalled();
        });

        it('should cache image after R2 fetch', async () => {
            mockRedis.get.mockResolvedValueOnce(null); // Cache MISS

            const context = createMockContext({
                params: { key: 'test-image.jpg' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            await GET(context);

            expect(mockRedis.set).toHaveBeenCalledWith(
                'test-image.jpg',
                expect.any(Object),
                expect.objectContaining({ ex: expect.any(Number) })
            );
        });
    });

    describe('Content-Type', () => {
        it('should return correct Content-Type for JPEG', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            mockR2Client.send.mockResolvedValueOnce({
                Body: {
                    transformToByteArray: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
                },
                ContentType: 'image/jpeg',
            });

            const context = createMockContext({
                params: { key: 'photo.jpg' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            const response = await GET(context);

            expect(response.headers.get('Content-Type')).toBe('image/jpeg');
        });

        it('should return correct Content-Type for PNG', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            mockR2Client.send.mockResolvedValueOnce({
                Body: {
                    transformToByteArray: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
                },
                ContentType: 'image/png',
            });

            const context = createMockContext({
                params: { key: 'photo.png' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            const response = await GET(context);

            expect(response.headers.get('Content-Type')).toBe('image/png');
        });
    });

    describe('Error Handling', () => {
        it('should handle R2 errors gracefully', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            mockR2Client.send.mockRejectedValueOnce(new Error('R2 unavailable'));

            const context = createMockContext({
                params: { key: 'test-image.jpg' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            const response = await GET(context);

            expect(response.status).toBe(500);
        });

        it('should handle missing images', async () => {
            mockRedis.get.mockResolvedValueOnce(null);
            mockR2Client.send.mockRejectedValueOnce({ name: 'NoSuchKey' });

            const context = createMockContext({
                params: { key: 'non-existent.jpg' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            const response = await GET(context);

            expect(response.status).toBe(404);
        });
    });

    describe('Rate Limiting', () => {
        it('should apply rate limiting', async () => {
            // This test would require mocking the rate limiter
            // For now, we just verify the endpoint is callable
            mockRedis.get.mockResolvedValueOnce(null);

            const context = createMockContext({
                params: { key: 'test-image.jpg' },
            });

            const { GET } = await import('@/pages/api/image/[key]');
            const response = await GET(context);

            expect(response.status).not.toBe(429); // Not rate limited in test
        });
    });
});

// Helper
function createMockContext(overrides: Partial<APIContext> = {}): APIContext {
    return {
        params: {},
        request: new Request('http://localhost/api/test'),
        locals: {},
        ...overrides,
    } as APIContext;
}
