/**
 * 🔧 MongoDB Schema con Índices Optimizados
 * 
 * ✅ Restaurado a estructura original con todos los campos
 * ✅ Manteniendo índices optimizados
 */

import mongoose from 'mongoose';

const DesaparecidoSchema = new mongoose.Schema({
    extranjero: {
        type: String,
        enum: ['V', 'E'],
        required: false,
    },
    cedula: {
        type: String,
        required: false,
    },
    nombre: {
        type: String,
        required: true,
    },
    estado: {
        type: String,
        required: false,
    },
    sexo: {
        type: String,
        enum: ['Masculino', 'Femenino'],
        required: false,
    },
    edad: {
        type: Number,
        required: false,
    },
    nacionalidad: {
        type: String,
        required: false,
    },
    profesion: {
        type: String,
        required: false,
    },
    condicion_de_salud: {
        type: String,
        required: false,
    },
    discapacidad: {
        type: String,
        required: false,
    },
    lugar_de_confinamiento: {
        type: String,
        required: false,
    },
    lugar_de_desaparicion: {
        type: String,
        required: false,
    },
    fecha: {
        type: String,
        required: false,
    },
    hora: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: props => `${props.value} no es una hora válida en formato 24:00hs (hh:mm)!`
        }
    },
    etnia: {
        type: String,
        required: false,
    },
    imagen: {
        type: String,
        required: false,
    },
    etiqueta: {
        type: String,
        enum: ['blue', 'green'],
        required: false
    },
    estado_registro: {
        type: String,
        enum: ['pendiente', 'aprobado'],
        default: 'pendiente',
        required: true,
    }
}, {
    timestamps: true, // createdAt, updatedAt
    strict: false, // ✅ Permitir campos no definidos en el schema
});

// ✅ Índices optimizados para queries frecuentes
DesaparecidoSchema.index({ estado_registro: 1 });
DesaparecidoSchema.index({ nombre: 'text' });
DesaparecidoSchema.index({ cedula: 1 });
DesaparecidoSchema.index({ fecha: -1 });
DesaparecidoSchema.index({ etiqueta: 1 });

// ✅ Índice compuesto para query común
// Optimiza: find({ estado_registro }).sort({ fecha: -1 })
DesaparecidoSchema.index({ estado_registro: 1, fecha: -1 });

// ✅ Índice para búsqueda por lugar
DesaparecidoSchema.index({ lugar_de_desaparicion: 1 });

// ✅ Exportar modelo
export const Desaparecido = mongoose.models.Desaparecido ||
    mongoose.model('Desaparecido', DesaparecidoSchema);
