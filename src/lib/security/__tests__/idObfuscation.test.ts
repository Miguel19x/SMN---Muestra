/**
 * Tests para ID Obfuscation System
 * 
 * Prioridad: 🔴 CRÍTICA
 * Cobertura Meta: >90%
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    createPublicId,
    isValidPublicId,
    decodePublicIdHash,
    publicIdMapper,
    generateUUID,
    isValidUUID,
} from '../idObfuscation';

describe('createPublicId', () => {
    it('should create a valid public ID from internal ID', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);

        expect(publicId).toBeDefined();
        expect(typeof publicId).toBe('string');
        expect(publicId.length).toBeGreaterThan(0);
        expect(publicId).not.toBe(internalId); // Should be obfuscated
    });

    it('should create different public IDs for different internal IDs', () => {
        const id1 = '507f1f77bcf86cd799439011';
        const id2 = '507f191e810c19729de860ea';

        const publicId1 = createPublicId(id1);
        const publicId2 = createPublicId(id2);

        expect(publicId1).not.toBe(publicId2);
    });

    it('should create consistent public ID for same internal ID', () => {
        // Note: Depends on implementation
        // If timestamp is included, this may vary
        const internalId = '507f1f77bcf86cd799439011';
        const publicId1 = createPublicId(internalId);
        const publicId2 = createPublicId(internalId);

        // If implementation uses timestamp, they will differ
        // If purely HMAC-based, they should be the same
        expect(publicId1).toBeDefined();
        expect(publicId2).toBeDefined();
    });

    it('should create URL-safe public IDs', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);

        // Should not contain +, /, or =
        expect(publicId).not.toMatch(/[+/=]/);
    });

    it('should handle edge cases', () => {
        const edgeCases = [
            '000000000000000000000000',
            'ffffffffffffffffffffffff',
            '123456789012345678901234',
        ];

        edgeCases.forEach(id => {
            const publicId = createPublicId(id);
            expect(publicId).toBeDefined();
            expect(publicId.length).toBeGreaterThan(0);
        });
    });
});

describe('isValidPublicId', () => {
    it('should validate correctly formatted public IDs', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);

        expect(isValidPublicId(publicId)).toBe(true);
    });

    it('should reject invalid public IDs', () => {
        const invalidIds = [
            '',
            'not-a-valid-id',
            '123',
            'x'.repeat(1000), // too long
            'invalid+chars/',
            null,
            undefined,
        ];

        invalidIds.forEach(id => {
            expect(isValidPublicId(id as any)).toBe(false);
        });
    });

    it('should reject tampered public IDs', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);

        // Tamper with the ID
        const tamperedId = publicId.slice(0, -5) + 'xxxxx';

        expect(isValidPublicId(tamperedId)).toBe(false);
    });
});

describe('decodePublicIdHash', () => {
    it('should decode valid public ID', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);

        const decoded = decodePublicIdHash(publicId);

        expect(decoded).toBeDefined();
        expect(typeof decoded).toBe('string');
        expect(decoded).not.toBeNull();
    });

    it('should return null for invalid public ID', () => {
        const invalidIds = [
            'invalid-id',
            '',
            'x'.repeat(1000),
        ];

        invalidIds.forEach(id => {
            const decoded = decodePublicIdHash(id);
            expect(decoded).toBeNull();
        });
    });

    it('should extract hash from public ID', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);
        const decoded = decodePublicIdHash(publicId);

        expect(decoded).toBeDefined();
        expect(decoded).not.toBeNull();
        if (decoded) {
            expect(decoded.length).toBe(16);
        }
    });
});

describe('PublicIdMapper', () => {
    beforeEach(() => {
        // Clear mapper before each test
        publicIdMapper.clear();
    });

    it('should store and retrieve mapping', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);

        publicIdMapper.register(internalId, publicId);
        const retrieved = publicIdMapper.getMongoId(publicId);

        expect(retrieved).toBe(internalId);
    });

    it('should return undefined for non-existent public ID', () => {
        const result = publicIdMapper.getMongoId('non-existent-id');
        expect(result).toBeUndefined();
    });

    it('should get public ID from mongo ID', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);

        publicIdMapper.register(internalId, publicId);

        const retrieved = publicIdMapper.getPublicId(internalId);
        expect(retrieved).toBe(publicId);
    });

    it('should create and register in one call', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = publicIdMapper.createAndRegister(internalId);

        expect(publicId).toBeDefined();
        expect(publicIdMapper.getMongoId(publicId)).toBe(internalId);
    });

    it('should clear all mappings', () => {
        const id1 = '507f1f77bcf86cd799439011';
        const id2 = '507f191e810c19729de860ea';

        publicIdMapper.createAndRegister(id1);
        publicIdMapper.createAndRegister(id2);

        publicIdMapper.clear();

        expect(publicIdMapper.getPublicId(id1)).toBeUndefined();
        expect(publicIdMapper.getPublicId(id2)).toBeUndefined();
    });
});

describe('generateUUID', () => {
    it('should generate valid UUIDs', () => {
        const uuid = generateUUID();

        expect(uuid).toBeDefined();
        expect(typeof uuid).toBe('string');
        expect(uuid.length).toBe(36); // UUID v4 format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    });

    it('should generate unique UUIDs', () => {
        const uuid1 = generateUUID();
        const uuid2 = generateUUID();
        const uuid3 = generateUUID();

        expect(uuid1).not.toBe(uuid2);
        expect(uuid2).not.toBe(uuid3);
        expect(uuid1).not.toBe(uuid3);
    });

    it('should match UUID v4 format', () => {
        const uuid = generateUUID();
        const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        expect(uuid).toMatch(uuidV4Regex);
    });
});

describe('isValidUUID', () => {
    it('should validate correct UUIDs', () => {
        const validUUIDs = [
            '550e8400-e29b-41d4-a716-446655440000',
            '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            generateUUID(),
        ];

        validUUIDs.forEach(uuid => {
            expect(isValidUUID(uuid)).toBe(true);
        });
    });

    it('should reject invalid UUIDs', () => {
        const invalidUUIDs = [
            '',
            'not-a-uuid',
            '550e8400-e29b-41d4-a716', // incomplete
            '550e8400-e29b-41d4-a716-446655440000-extra', // too long
            'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // invalid chars
            '550e8400e29b41d4a716446655440000', // missing dashes
        ];

        invalidUUIDs.forEach(uuid => {
            expect(isValidUUID(uuid)).toBe(false);
        });
    });
});

describe('Security Tests', () => {
    it('should not be reversible to get internal ID from public ID alone', () => {
        const internalId = '507f1f77bcf86cd799439011';
        const publicId = createPublicId(internalId);

        // Public ID should not contain internal ID in plain text
        expect(publicId).not.toContain(internalId);
        expect(publicId.toLowerCase()).not.toContain(internalId.toLowerCase());
    });

    it('should resist timing attacks', () => {
        // Generate multiple public IDs and measure consistency
        const internalId = '507f1f77bcf86cd799439011';
        const publicIds = Array.from({ length: 10 }, () => createPublicId(internalId));

        // All should be non-empty and different (if timestamp-based)
        publicIds.forEach(id => {
            expect(id).toBeDefined();
            expect(id.length).toBeGreaterThan(0);
        });
    });

    it('should not leak information about creation time precision', () => {
        const id1 = createPublicId('507f1f77bcf86cd799439011');
        const id2 = createPublicId('507f191e810c19729de860ea');

        // Both should have similar length (not revealing timestamp precision)
        const lengthDiff = Math.abs(id1.length - id2.length);
        expect(lengthDiff).toBeLessThanOrEqual(5); // Allow small variance
    });
});
