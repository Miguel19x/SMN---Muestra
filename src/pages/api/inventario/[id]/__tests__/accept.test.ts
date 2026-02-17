/**
 * Integration Tests - Accept API
 * 
 * Tests para POST /api/inventario/[id]/accept
 * - Autenticación requerida
 * - Validación ObjectId
 * - Cache invalidation
 * - Estado actualizado
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
    estado_registro: 'pendiente',
    etiqueta: 'blue',
    save: vi.fn().mockResolvedValue(true),
};

const mockDesaparecidoModel = {
    findById: vi.fn().mockResolvedValue(mockDesaparecido),
};

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

describe('POST /api/inventario/[id]/accept', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDesaparecido.estado_registro = 'pendiente';
        mockDesaparecido.etiqueta = 'blue';
    });

    describe('Authentication', () => {
        it('should reject unauthenticated requests', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: {}, // No user
            });

            // Import dynamically to avoid top-level await issues
            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            const response = await POST(context);

            expect(response.status).toBe(401);
        });

        it('should allow authenticated admin requests', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            const response = await POST(context);

            expect(response.status).toBe(200);
        });
    });

    describe('Validation', () => {
        it('should reject invalid ObjectId', async () => {
            const context = createMockContext({
                params: { id: 'invalid-id' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            const response = await POST(context);

            expect(response.status).toBe(400);
        });

        it('should return 404 for non-existent record', async () => {
            mockDesaparecidoModel.findById.mockResolvedValueOnce(null);

            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            const response = await POST(context);

            expect(response.status).toBe(404);
        });
    });

    describe('Business Logic', () => {
        it('should update estado_registro to aprobado', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            await POST(context);

            expect(mockDesaparecido.estado_registro).toBe('aprobado');
        });

        it('should remove etiqueta field', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            await POST(context);

            expect(mockDesaparecido.etiqueta).toBeUndefined();
        });

        it('should call save() on the document', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            await POST(context);

            expect(mockDesaparecido.save).toHaveBeenCalled();
        });
    });

    describe('Cache Invalidation', () => {
        it('should invalidate pendiente cache', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            await POST(context);

            expect(mockRedis.del).toHaveBeenCalledWith('desaparecidos:pendiente');
        });

        it('should invalidate aprobado cache', async () => {
            const context = createMockContext({
                params: { id: '507f1f77bcf86cd799439011' },
                locals: { user: { role: 'admin' } },
            });

            const { POST } = await import('@/pages/api/inventario/[id]/accept');
            await POST(context);

            expect(mockRedis.del).toHaveBeenCalledWith('desaparecidos:aprobado');
        });
    });
});

// Helper to create mock Astro context
function createMockContext(overrides: Partial<APIContext> = {}): APIContext {
    return {
        params: {},
        request: new Request('http://localhost/api/test'),
        locals: {},
        ...overrides,
    } as APIContext;
}
