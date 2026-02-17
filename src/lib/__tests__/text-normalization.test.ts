import { describe, it, expect } from 'vitest';
import { normalizeText } from '../profanity-filter';

describe('Text Normalization', () => {
    describe('normalizeText function', () => {
        it('convierte texto a minúsculas', () => {
            expect(normalizeText('HOLA MUNDO')).toBe(normalizeText('hola mundo'));
            expect(normalizeText('MiXeD CaSe')).toBe(normalizeText('mixed case'));
        });

        it('normaliza acentos españoles', () => {
            const testCases = [
                { input: 'á', expected: 'a' },
                { input: 'é', expected: 'e' },
                { input: 'í', expected: 'i' },
                { input: 'ó', expected: 'o' },
                { input: 'ú', expected: 'u' },
                { input: 'ñ', expected: 'n' },
                { input: 'ü', expected: 'u' },
            ];

            testCases.forEach(({ input, expected }) => {
                const result = normalizeText(input);
                expect(result).toBe(expected);
            });
        });

        it('normaliza combinaciones de acentos', () => {
            expect(normalizeText('Cabrón')).toContain(normalizeText('cabron').toLowerCase());
            expect(normalizeText('José')).toContain(normalizeText('jose').toLowerCase());
            expect(normalizeText('María')).toContain(normalizeText('maria').toLowerCase());
        });

        it('preserva números', () => {
            const text = 'texto123';
            const normalized = normalizeText(text);
            expect(normalized).toContain('123');
        });

        it('maneja texto vacío', () => {
            expect(normalizeText('')).toBe('');
        });

        it('maneja solo espacios', () => {
            const result = normalizeText('   ');
            expect(result.trim()).toBe('');
        });

        it('maneja caracteres especiales', () => {
            const text = 'hola@mundo.com';
            const normalized = normalizeText(text);
            expect(typeof normalized).toBe('string');
            expect(normalized.length).toBeGreaterThan(0);
        });
    });

    describe('Edge cases', () => {
        it('maneja texto muy largo', () => {
            const longText = 'a'.repeat(10000);
            const normalized = normalizeText(longText);
            expect(normalized.length).toBe(longText.length);
        });

        it('maneja Unicode avanzado', () => {
            const emoji = '😀 hola 🎉';
            const normalized = normalizeText(emoji);
            expect(typeof normalized).toBe('string');
        });

        it('maneja texto con saltos de línea', () => {
            const text = 'línea1\nlínea2\rlínea3';
            const normalized = normalizeText(text);
            expect(typeof normalized).toBe('string');
        });
    });
});
