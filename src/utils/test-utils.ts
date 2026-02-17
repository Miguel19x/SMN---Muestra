/**
 * Test Utilities
 * 
 * Funciones helper para testing unitario.
 * Vitest ya está instalado. Para correr tests: pnpm test
 */

import { expect, vi } from 'vitest';

/**
 * Mock de MongoDB para testing
 */
export const mockMongoConnection = () => {
    return {
        connect: vi.fn().mockResolvedValue(true),
        disconnect: vi.fn().mockResolvedValue(true),
        isConnected: true
    };
};

/**
 * Mock de datos de desaparecido para testing
 */
export const mockDesaparecido = (overrides = {}) => {
    return {
        _id: '507f1f77bcf86cd799439011',
        nombre: 'Juan Pérez',
        cedula: '12345678',
        edad: 25,
        sexo: 'Masculino',
        nacionalidad: 'Nacional',
        fecha: '2024-01-15',
        estado_registro: 'aprobado',
        extranjero: 'V',
        ...overrides
    };
};

/**
 * Mock de respuesta de API
 */
export const mockApiResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
};

/**
 * Esperar a que una condición se cumpla (útil para tests asíncronos)
 */
export const waitFor = async (
    callback: () => boolean | Promise<boolean>,
    timeout = 5000
): Promise<void> => {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        if (await callback()) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error(`Timeout: condition not met after ${timeout}ms`);
};

/**
 * Mock de localStorage para testing
 */
export const mockLocalStorage = () => {
    const store: { [key: string]: string } = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            Object.keys(store).forEach(key => delete store[key]);
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index: number) => {
            const keys = Object.keys(store);
            return keys[index] || null;
        }
    };
};

/**
 * Matcher personalizado: expect(value).toBeValidCedula()
 */
export const toBeValidCedula = (received: string) => {
    const isValid = /^[VE]-?\d{6,9}$/.test(received);

    return {
        message: () =>
            `expected ${received} ${isValid ? 'not ' : ''}to be a valid Venezuelan cédula`,
        pass: isValid
    };
};

// Extender expect con matchers personalizados
expect.extend({
    toBeValidCedula
});
