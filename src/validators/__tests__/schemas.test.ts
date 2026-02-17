/**
 * Tests para Validation Schemas (Zod)
 * 
 * Prioridad: 🔴 CRÍTICA
 * Cobertura Meta: >90%
 */

import { describe, it, expect } from 'vitest';
import {
    ObjectIdSchema,
    CedulaSchema,
    ISODateSchema,
    CreateDesaparecidoSchema,
    GetDesaparecidosQuerySchema,
    CreateRemovalRequestSchema,
    UpdateRemovalRequestSchema,
} from '../schemas';

describe('ObjectIdSchema', () => {
    it('should accept valid ObjectId strings', () => {
        const validIds = [
            '507f1f77bcf86cd799439011',
            '507f191e810c19729de860ea',
            '6580e1f2a3b4c5d6e7f89012',
        ];

        validIds.forEach(id => {
            const result = ObjectIdSchema.safeParse(id);
            expect(result.success).toBe(true);
        });
    });

    it('should reject invalid ObjectId strings', () => {
        const invalidIds = [
            'not-an-objectid',
            '123',
            '',
            'xxxxxxxxxxxxxxxxxxxxxxxx',
            '507f1f77bcf86cd79943901', // too short
            '507f1f77bcf86cd799439011x', // too long
            '507f1f77bcf86cd799439-11', // invalid char
        ];

        invalidIds.forEach(id => {
            const result = ObjectIdSchema.safeParse(id);
            expect(result.success).toBe(false);
        });
    });

    it('should reject NoSQL injection attempts', () => {
        const injectionAttempts = [
            { $ne: null },
            { $gt: '' },
            { $regex: '.*' },
            ['507f1f77bcf86cd799439011'],
        ];

        injectionAttempts.forEach(attempt => {
            const result = ObjectIdSchema.safeParse(attempt);
            expect(result.success).toBe(false);
        });
    });
});

describe('CedulaSchema', () => {
    it('should accept valid Venezuelan cedulas', () => {
        const validCedulas = [
            'V-12345678',
            'E-12345678',
            'V-1234567',
            'E-123456789',
            'V12345678', // sin guión
            'E12345678',
        ];

        validCedulas.forEach(cedula => {
            const result = CedulaSchema.safeParse(cedula);
            expect(result.success).toBe(true);
        });
    });

    it('should reject invalid cedulas', () => {
        const invalidCedulas = [
            'A-12345678', // letra inválida
            'V-123', // muy corta
            'V-12345678901', // muy larga
            '12345678', // sin prefijo
            'VE-12345678', // prefijo inválido
        ];

        invalidCedulas.forEach(cedula => {
            const result = CedulaSchema.safeParse(cedula);
            expect(result.success).toBe(false);
        });
    });
});

describe('ISODateSchema', () => {
    it('should accept valid ISO date strings', () => {
        const validDates = [
            '2024-01-15',
            '2024-12-31',
            '2023-06-01',
        ];

        validDates.forEach(date => {
            const result = ISODateSchema.safeParse(date);
            expect(result.success).toBe(true);
        });
    });

    it('should reject invalid date formats', () => {
        const invalidDates = [
            '2024/01/15', // slashes
            '15-01-2024', // DD-MM-YYYY
            '2024-1-5', // sin ceros
            '2024-13-01', // mes inválido
            '2024-12-32', // día inválido
            'not-a-date',
        ];

        invalidDates.forEach(date => {
            const result = ISODateSchema.safeParse(date);
            expect(result.success).toBe(false);
        });
    });
});

describe('CreateDesaparecidoSchema', () => {
    const validData = {
        nombre: 'Juan Pérez',
        cedula: 'V-12345678',
        edad: 25,
        sexo: 'Masculino' as const,
        extranjero: 'V' as const,
        nacionalidad: 'Nacional',
        fecha: '2024-01-15',
        captchaToken: 'test-token',
    };

    it('should accept valid desaparecido data', () => {
        const result = CreateDesaparecidoSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should require nacionalidad for extranjeros', () => {
        const extranjerData = {
            ...validData,
            extranjero: 'E' as const,
            nacionalidad: 'Colombiana',
        };

        const result = CreateDesaparecidoSchema.safeParse(extranjerData);
        expect(result.success).toBe(true);
    });

    it('should reject extranjero without nacionalidad', () => {
        const invalidData = {
            ...validData,
            extranjero: 'E' as const,
            nacionalidad: undefined,
        };

        const result = CreateDesaparecidoSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });

    it('should reject invalid edad', () => {
        const invalidAges = [-1, 151, 0.5, 200];

        invalidAges.forEach(edad => {
            const result = CreateDesaparecidoSchema.safeParse({
                ...validData,
                edad,
            });
            expect(result.success).toBe(false);
        });
    });

    it('should reject invalid sexo', () => {
        const result = CreateDesaparecidoSchema.safeParse({
            ...validData,
            sexo: 'Otro',
        });
        expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
        const dataWithOptionals = {
            ...validData,
            profesion: 'Ingeniero',
            etnia: 'Mestizo',
            lugar_de_desaparicion: 'Caracas',
            imagen: 'https://images.nomassecuestros.com/test.jpg',
        };

        const result = CreateDesaparecidoSchema.safeParse(dataWithOptionals);
        expect(result.success).toBe(true);
    });
});

describe('GetDesaparecidosQuerySchema', () => {
    it('should accept valid estado_registro values', () => {
        const validEstados = ['aprobado', 'pendiente', 'rechazado'];

        validEstados.forEach(estado => {
            const result = GetDesaparecidosQuerySchema.safeParse({ estado_registro: estado });
            expect(result.success).toBe(true);
        });
    });

    it('should use default value when estado_registro is not provided', () => {
        const result = GetDesaparecidosQuerySchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.estado_registro).toBe('aprobado');
        }
    });

    it('should reject invalid estado_registro', () => {
        const result = GetDesaparecidosQuerySchema.safeParse({
            estado_registro: 'invalid',
        });
        expect(result.success).toBe(false);
    });
});

describe('CreateRemovalRequestSchema', () => {
    const validRequest = {
        desaparecidoId: '507f1f77bcf86cd799439011',
        solicitante: 'María González',
        parentesco: 'Madre',
        motivo: 'Persona fue encontrada con vida',
        correo_contacto: 'maria@example.com',
        captchaToken: 'test-token',
    };

    it('should accept valid removal request', () => {
        const result = CreateRemovalRequestSchema.safeParse(validRequest);
        expect(result.success).toBe(true);
    });

    it('should accept anonymous request (without solicitante)', () => {
        const anonymousRequest = {
            desaparecidoId: '507f1f77bcf86cd799439011',
            motivo: 'Solicitud anónima',
            captchaToken: 'test-token',
        };

        const result = CreateRemovalRequestSchema.safeParse(anonymousRequest);
        expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
        const result = CreateRemovalRequestSchema.safeParse({
            ...validRequest,
            correo_contacto: 'not-an-email',
        });
        expect(result.success).toBe(false);
    });

    it('should reject too long text fields', () => {
        const longString = 'a'.repeat(1001);
        const result = CreateRemovalRequestSchema.safeParse({
            ...validRequest,
            motivo: longString,
        });
        expect(result.success).toBe(false);
    });
});

describe('UpdateRemovalRequestSchema', () => {
    it('should accept valid approved status', () => {
        const result = UpdateRemovalRequestSchema.safeParse({
            estado: 'approved',
        });
        expect(result.success).toBe(true);
    });

    it('should accept valid rejected status', () => {
        const result = UpdateRemovalRequestSchema.safeParse({
            estado: 'rejected',
        });
        expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
        const result = UpdateRemovalRequestSchema.safeParse({
            estado: 'pending',
        });
        expect(result.success).toBe(false);
    });
});


