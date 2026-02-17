import { describe, it, expect } from 'vitest';
import { containsProfanity } from '../profanity-filter';

describe('Profanity Filter', () => {
    describe('Detección básica', () => {
        it('detecta groserías simples', () => {
            expect(containsProfanity('puta')).toBe(true);
            expect(containsProfanity('marico')).toBe(true);
            expect(containsProfanity('pendejo')).toBe(true);
        });

        it('no bloquea texto limpio', () => {
            expect(containsProfanity('Hola mundo')).toBe(false);
            expect(containsProfanity('Juan Pérez')).toBe(false);
            expect(containsProfanity('Profesión: Ingeniero')).toBe(false);
        });
    });

    describe('Detección de variantes l33tspeak', () => {
        it('detecta números como letras', () => {
            expect(containsProfanity('p3nd3j0')).toBe(true);
            expect(containsProfanity('m4r1c0')).toBe(true);
            expect(containsProfanity('put4')).toBe(true);
        });

        it('detecta símbolos como letras', () => {
            expect(containsProfanity('m@rico')).toBe(true);
            expect(containsProfanity('pend€jo')).toBe(true);
        });
    });

    describe('Detección de espaciado intencional', () => {
        it('detecta palabras con espacios', () => {
            expect(containsProfanity('p u t a')).toBe(true);
            expect(containsProfanity('m a r i c o')).toBe(true);
        });

        it('detecta palabras con puntos', () => {
            expect(containsProfanity('p.u.t.a')).toBe(true);
            expect(containsProfanity('m.a.r.i.c.o')).toBe(true);
        });

        it('detecta palabras con guiones', () => {
            expect(containsProfanity('p-u-t-a')).toBe(true);
            expect(containsProfanity('m-a-r-i-c-o')).toBe(true);
        });
    });

    describe('Detección de repeticiones', () => {
        it('detecta caracteres repetidos', () => {
            expect(containsProfanity('puuuuuuta')).toBe(true);
            expect(containsProfanity('maaaaarico')).toBe(true);
            expect(containsProfanity('pendeeeeejo')).toBe(true);
        });
    });

    describe('Manejo de acentos', () => {
        it('detecta palabras con y sin acentos', () => {
            expect(containsProfanity('cabrón')).toBe(true);
            expect(containsProfanity('cabron')).toBe(true);
        });
    });

    describe('Case insensitive', () => {
        it('detecta independientemente de mayúsculas', () => {
            expect(containsProfanity('PUTA')).toBe(true);
            expect(containsProfanity('Marico')).toBe(true);
            expect(containsProfanity('PeNdEjO')).toBe(true);
        });
    });
});
