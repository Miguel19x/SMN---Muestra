/**
 * Integration Tests - Reject API
 * 
 * Tests para POST /api/desaparecidos/[id]/reject
 * - Autenticación requerida
 * - Eliminación de registro
 * - Eliminación imagen R2
 * - Cache invalidation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { APIContext } from 'astro';

// Mocks
const mockRedis = {
    del: vi.fn().mockResolvedValue(1),
    get: vi.fn(),
    set: vi.fn(),
};

const mockDesaparecido = {
    _id: '507f1f77bcf86cd799439011',
    nombre: 'Test Person',
    imagen: 'test-image.jpg',
    estado_registro: 'pendiente',
};

const mockDesaparecidoModel = {
    findByIdAndDelete: vi.fn().mockResolvedValue(mockDesaparecido),
};

const mockDeleteImageFromR2 = vi.fn().mockResolvedValue(true);

// Mock modules
vi.mock('@/lib/redis', () => ({
    redis: mockRedis,
}));

vi.mock('@/models/desaparecido', () => ({
    Desaparecido: mockDesaparecidoModel,
}));

vi.mock('@/lib/mongodb', () => ({
    connectDB: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/lib/r2-client', () => ({
    deleteImageFromR2: mockDeleteImageFromR2,
}));

describe('POST /api/desaparecidos/[id]/reject', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Authentication', () => {
        it('should reject unauthenticated requests', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: {},
            });

            const { POST } = await import('@/pages/api/desaparecidos/[id]/reject');
            const response = await POST(context);

            expect(response.status).toBe(401);
        });
    });

    describe('Validation', () => {
        it('should reject invalid ObjectId', async () => {
            const context = createMockContext({
                params: { id: 'invalid-id' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/desaparecidos/[id]/reject');
            const response = await POST(context);

            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent record', async () => {
            mockDesaparecidoModel.findByIdAndDelete.mockResolvedValueOnce(null);

            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/desaparecidos/[id]/reject');
            const response = await POST(context);

            expect(response.status).toBe(404);
        });
    });

    describe('Deletion Logic', () => {
        it('should delete record from database', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/desaparecidos/[id]/reject');
            await POST(context);

            expect(mockDesaparecidoModel.findByIdAndDelete).toHaveBeenCalledWith(
                '507f1f77bcf86cd799439011'
            );
        });

        it('should delete image from R2 if present', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/desaparecidos/[id]/reject');
            await POST(context);

            expect(mockDeleteImageFromR2).toHaveBeenCalledWith('test-image.jpg');
        });

        it('should handle records without images', async () => {
            mockDesaparecidoModel.findByIdAndDelete.mockResolvedValueOnce({
                ...mockDesaparecido,
                imagen: null,
            });

            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/desaparecidos/[id]/reject');
            const response = await POST(context);

            expect(response.status).toBe(200);
            expect(mockDeleteImageFromR2).not.toHaveBeenCalled();
        });
    });

    describe('Cache Invalidation', () => {
        it('should invalidate all estado caches', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/desaparecidos/[id]/reject');
            await POST(context);

            expect(mockRedis.del).toHaveBeenCalledWith('desaparecidos:pendiente');
            expect(mockRedis.del).toHaveBeenCalledWith('desaparecidos:aprobado');
            expect(mockRedis.del).toHaveBeenCalledWith('desaparecidos:rechazado');
        });
    });

    describe('Error Handling', () => {
        it('should handle R2 deletion errors gracefully', async () => {
            mockDeleteImageFromR2.mockRejectedValueOnce(new Error('R2 error'));

            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/desaparecidos/[id]/reject');
            const response = await POST(context);

            // Should still succeed even if R2 deletion fails
            expect(response.status).toBe(200);
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
