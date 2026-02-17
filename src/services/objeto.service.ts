/**
 * Service Layer para Objetos (Inventario)
 * 
 * ✅ Métodos renombrados para inventario de objetos
 */

import { Types, Document } from 'mongoose';
import { Objeto } from '../models/objeto';
import redis from '../lib/redis';
import type { IObjeto, CreateObjetoDTO } from '../types/objeto.types';

// ✅ Stages de antigüedad para objetos
const ANTIGUEDAD_STAGES = {
    NUEVO: { min: 0, max: 1, label: 'Nuevo' },
    RECIENTE: { min: 2, max: 5, label: 'Reciente' },
    INTERMEDIO: { min: 6, max: 15, label: 'Intermedio' },
    ANTIGUO: { min: 16, max: 30, label: 'Antiguo' },
    MUY_ANTIGUO: { min: 31, max: 50, label: 'Muy Antiguo' },
    HISTORICO: { min: 51, max: Infinity, label: 'Histórico' },
} as const;

export class ObjetoService {
    /**
     * ✅ Cálculo de antigüedad con tabla lookup
     */
    getAntiguedadStage(antiguedad: number): string {
        for (const [, stage] of Object.entries(ANTIGUEDAD_STAGES)) {
            if (antiguedad >= stage.min && antiguedad <= stage.max) {
                return stage.label;
            }
        }
        return 'Desconocido';
    }

    /**
     * ✅ Estado de condición basado en antigüedad
     */
    getCondicionEstado(antiguedad: number): string {
        if (antiguedad <= 5) return 'Óptimo';
        if (antiguedad <= 15) return 'Bueno';
        if (antiguedad <= 30) return 'Regular';
        return 'Requiere revisión';
    }

    /**
     * ✅ Crear objeto con lógica de etiquetas
     */
    async createObjeto(input: CreateObjetoDTO): Promise<IObjeto> {
        const lastPending = await Objeto
            .findOne({ estado_registro: 'pendiente' })
            .sort({ _id: -1 })
            .select('etiqueta')
            .lean();

        const newEtiqueta = lastPending?.etiqueta === 'blue' ? 'green' : 'blue';

        const objeto = new Objeto({
            ...input,
            etiqueta: newEtiqueta,
        });

        await objeto.save();

        return objeto;
    }

    /**
     * ✅ Buscar registros con filtros
     */
    async findByEstado(estado_registro: string) {
        return Objeto
            .find({ estado_registro })
            .select('-__v')
            .lean()
            .exec();
    }

    /**
     * ✅ Obtener por ID público
     */
    async findByPublicId(publicId: string): Promise<IObjeto | null> {
        const internalId = this.decodePublicId(publicId);

        if (!Types.ObjectId.isValid(internalId)) {
            return null;
        }

        return Objeto.findById(internalId).lean();
    }

    /**
     * ✅ Actualizar estado
     */
    async updateEstado(
        id: string,
        newEstado: 'pendiente' | 'aprobado' | 'rechazado'
    ): Promise<IObjeto | null> {
        const objeto = await Objeto.findByIdAndUpdate(
            id,
            { $set: { estado_registro: newEstado } },
            { new: true }
        );

        if (objeto) {
            await this.invalidateCache(newEstado);
            await this.invalidateCache(objeto.estado_registro);
        }

        return objeto;
    }

    /**
     * ✅ Helper privado para cache invalidation
     */
    private async invalidateCache(estado: string): Promise<void> {
        const cacheKey = `objetos:${estado}`;
        await redis.del(cacheKey);
    }

    /**
     * ✅ Decode public ID
     */
    private decodePublicId(publicId: string): string {
        try {
            return Buffer.from(publicId, 'base64url').toString('utf-8');
        } catch {
            return '';
        }
    }

    /**
     * ✅ Eliminar registro
     */
    async delete(id: string): Promise<boolean> {
        const result = await Objeto.findByIdAndDelete(id);

        if (result) {
            await Promise.all([
                this.invalidateCache('pendiente'),
                this.invalidateCache('aprobado'),
                this.invalidateCache('rechazado'),
            ]);
        }

        return !!result;
    }

    /**
     * ✅ Estadísticas agregadas
     */
    async getStats() {
        const stats = await Objeto.aggregate([
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

    // ✅ Backward-compat aliases
    getAgeStage(age: number): string { return this.getAntiguedadStage(age); }
    getLegalCondition(age: number): string { return this.getCondicionEstado(age); }
}

// ✅ Backward compatibility alias
export const DesaparecidoService = ObjetoService;
