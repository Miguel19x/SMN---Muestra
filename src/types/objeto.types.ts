/**
 * TypeScript Types para Objeto (Inventario)
 * 
 * ✅ Campos renombrados para sistema de inventario de objetos
 */

import { Types } from 'mongoose';

/**
 * Interface para documento de MongoDB
 */
export interface IObjeto {
    _id: Types.ObjectId;
    nombre: string;
    codigo: string; // Serial number / identification code
    antiguedad: number; // Age in years
    categoria: string; // Tipo A, Tipo B, etc.
    origen: 'N' | 'I'; // Nacional / Importado
    pais_origen: string;
    tipo_objeto?: string;
    clasificacion?: string; // Clase A, B, C, D
    condicion?: string;
    estado_conservacion?: string;
    ubicacion_actual?: string;
    ultimo_lugar_conocido?: string;
    estado?: string; // Venezuelan state (location)
    fecha_registro: string; // ISO date string
    hora_registro?: string;
    imagen?: string;
    estado_registro: 'pendiente' | 'aprobado' | 'rechazado';
    etiqueta?: string;

    // Timestamps (Mongoose)
    createdAt?: Date;
    updatedAt?: Date;
}

// ✅ Backward compatibility alias
export type IDesaparecido = IObjeto;

/**
 * DTO para crear nuevo objeto
 */
export interface CreateObjetoDTO {
    nombre: string;
    codigo: string;
    antiguedad: number;
    categoria: string;
    origen: 'N' | 'I';
    pais_origen: string;
    tipo_objeto?: string;
    clasificacion?: string;
    condicion?: string;
    estado_conservacion?: string;
    ubicacion_actual?: string;
    ultimo_lugar_conocido?: string;
    fecha_registro: string;
    hora_registro?: string;
    imagen?: string;
    estado_registro: 'pendiente' | 'aprobado' | 'rechazado';
}

// ✅ Backward compatibility alias
export type CreateDesaparecidoDTO = CreateObjetoDTO;

/**
 * DTO para respuesta pública (con ID ofuscado)
 */
export interface ObjetoResponseDTO {
    id: string; // Public ID (NOT MongoDB _id)
    _id: string;
    nombre: string;
    codigo: string;
    antiguedad: number;
    categoria: string;
    origen: 'N' | 'I';
    pais_origen: string;
    tipo_objeto?: string;
    clasificacion?: string;
    condicion?: string;
    estado_conservacion?: string;
    ubicacion_actual?: string;
    ultimo_lugar_conocido?: string;
    estado?: string;
    fecha_registro: string;
    hora_registro?: string;
    imagen?: string;
    estado_registro: string;
    etiqueta?: string;
    // Calculated fields
    antiguedadStage: string;
    condicionEstado: string;
}

// ✅ Backward compatibility alias
export type DesaparecidoResponseDTO = ObjetoResponseDTO;
