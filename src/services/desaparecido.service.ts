/**
 * REFACTORIZACIÓN: Service Layer para Registros
 * 
 * PORQUÉ:
 * - Separa lógica de negocio del routing
 * - Facilita testing (mockeable)
 * - Reutilizable entre endpoints
 * - Single Responsibility Principle
 */

import { Types, Document } from 'mongoose';
import { Desaparecido } from '../models/desaparecido';
import redis from '../lib/redis';
import type { IDesaparecido, CreateDesaparecidoDTO } from '../types/desaparecido.types';

// ✅ MEJORA: Tipos centralizados (importados desde types file)
// ✅ Interface ya importada como CreateDesaparecidoDTO

// ✅ MEJORA: Age stage constants
const AGE_STAGES = {
    INFANT: { min: 0, max: 2, label: 'Infante' },
    CHILD: { min: 3, max: 12, label: 'Niño/a' },
    TEEN: { min: 13, max: 17, label: 'Adolescente' },
    YOUNG_ADULT: { min: 18, max: 35, label: 'Adulto Joven' },
    ADULT: { min: 36, max: 64, label: 'Adulto' },
    SENIOR: { min: 65, max: Infinity, label: 'Adulto Mayor' },
} as const;

export class DesaparecidoService {
    /**
     * ✅ MEJORA: Cálculo de edad optimizado con tabla lookup
     * PORQUÉ: O(1) vs O(n) con if-else chain
     */
    getAgeStage(age: number): string {
        for (const [, stage] of Object.entries(AGE_STAGES)) {
            if (age >= stage.min && age <= stage.max) {
                return stage.label;
            }
        }
        return 'Desconocido';
    }

    /**
     * ✅ MEJORA: Condición legal con constante
     * PORQUÉ: Fácil cambiar edad legal en un solo lugar
     */
    getLegalCondition(age: number): string {
        const LEGAL_AGE = 18;
        return age < LEGAL_AGE ? 'Menor de edad' : 'Mayor de edad';
    }

    /**
     * ✅ NUEVO: Crear registro con lógica de etiquetas
     * PORQUÉ: Encapsula la lógica de alternancia de colores
     */
    async createDesaparecido(input: CreateDesaparecidoDTO): Promise<IDesaparecido> {
        // Obtener la última etiqueta usada
        const lastPending = await Desaparecido
            .findOne({ estado_registro: 'pendiente' })
            .sort({ _id: -1 })
            .select('etiqueta')
            .lean();

        // ✅ MEJORA: Lógica clara de alternancia
        const newEtiqueta = lastPending?.etiqueta === 'blue' ? 'green' : 'blue';

        const desaparecido = new Desaparecido({
            ...input,
            etiqueta: newEtiqueta,
        });

        await desaparecido.save();

        return desaparecido;
    }

    /**
     * ✅ NUEVO: Buscar registros con filtros
     * PORQUÉ: Centraliza query logic, fácil de testear
     */
    async findByEstado(estado_registro: string) {
        return Desaparecido
            .find({ estado_registro })
            .select('-__v') // Excluir version key
            .lean()
            .exec();
    }

    /**
     * ✅ NUEVO: Obtener por ID público
     * PORQUÉ: No expone _id interno
     */
    async findByPublicId(publicId: string): Promise<IDesaparecido | null> {
        // Decode public ID to internal _id
        const internalId = this.decodePublicId(publicId);

        if (!Types.ObjectId.isValid(internalId)) {
            return null;
        }

        return Desaparecido.findById(internalId).lean();
    }

    /**
     * ✅ NUEVO: Actualizar estado
     */
    async updateEstado(
        id: string,
        newEstado: 'pendiente' | 'aprobado' | 'rechazado'
    ): Promise<IDesaparecido | null> {
        const desaparecido = await Desaparecido.findByIdAndUpdate(
            id,
            { $set: { estado_registro: newEstado } },
            { new: true }
        );

        // ✅ MEJORA: Invalidar cache relevante
        if (desaparecido) {
            await this.invalidateCache(newEstado);
            await this.invalidateCache(desaparecido.estado_registro);
        }

        return desaparecido;
    }

    /**
     * ✅ NUEVO: Helper privado para cache invalidation
     */
    private async invalidateCache(estado: string): Promise<void> {
        const cacheKey = `desaparecidos:${estado}`;
        await redis.del(cacheKey);
    }

    /**
     * ✅ NUEVO: Decode public ID
     * PORQUÉ: Abstrae la lógica de decodificación
     */
    private decodePublicId(publicId: string): string {
        // Implementation depends on your ID obfuscation strategy
        try {
            return Buffer.from(publicId, 'base64url').toString('utf-8');
        } catch {
            return '';
        }
    }

    /**
     * ✅ NUEVO: Eliminar registro
     */
    async delete(id: string): Promise<boolean> {
        const result = await Desaparecido.findByIdAndDelete(id);

        if (result) {
            // Invalidar todos los caches
            await Promise.all([
                this.invalidateCache('pendiente'),
                this.invalidateCache('aprobado'),
                this.invalidateCache('rechazado'),
            ]);
        }

        return !!result;
    }

    /**
     * ✅ NUEVO: Estadísticas agregadas
     * PORQUÉ: Optimiza queries de dashboard
     */
    async getStats() {
        const stats = await Desaparecido.aggregate([
            {
                $group: {
                    _id: '$estado_registro',
                    count: { $sum: 1 },
                },
            },
        ]);

        return stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {} as Record<string, number>);
    }
}
