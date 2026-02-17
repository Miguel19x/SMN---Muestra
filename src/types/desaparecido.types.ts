/**
 * TypeScript Types para Desaparecido
 * 
 * ✅ FIX P1-9: Tipos estrictos para eliminar `any`
 */

import { Types } from 'mongoose';

/**
 * Interface para documento de MongoDB
 */
export interface IDesaparecido {
    _id: Types.ObjectId;
    nombre: string;
    cedula: string;
    edad: number;
    sexo: 'Masculino' | 'Femenino';
    extranjero: 'V' | 'E';
    nacionalidad: string;
    profesion?: string;
    etnia?: string;
    lugar_de_desaparicion?: string;
    fecha: string; // ISO date string
    imagen?: string;
    estado_registro: 'pendiente' | 'aprobado' | 'rechazado';
    etiqueta?: string;

    // Timestamps (Mongoose)
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * DTO para crear nuevo desaparecido
 */
export interface CreateDesaparecidoDTO {
    nombre: string;
    cedula: string;
    edad: number;
    sexo: 'Masculino' | 'Femenino';
    extranjero: 'V' | 'E';
    nacionalidad: string;
    profesion?: string;
    etnia?: string;
    lugar_de_desaparicion?: string;
    fecha: string;
    imagen?: string;
    estado_registro: 'pendiente' | 'aprobado' | 'rechazado';
}

/**
 * DTO para respuesta pública (con ID ofuscado)
 */
export interface DesaparecidoResponseDTO {
    id: string; // Public ID (NOT MongoDB _id)
    nombre: string;
    cedula: string;
    edad: number;
    sexo: string;
    nacionalidad: string;
    fecha: string;
    imagen?: string;
    estado_registro: string;
    etiqueta?: string;
    // Calculated fields
    ageStage: string;
    legalCondition: string;
}
