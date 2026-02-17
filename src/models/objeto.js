/**
 * 🔧 MongoDB Schema - Object Inventory
 * 
 * ✅ Campos renombrados para sistema de inventario de objetos
 * ✅ Nota: El nombre de colección MongoDB se mantiene como 'Desaparecido' por compatibilidad
 */

import mongoose from 'mongoose';

const ObjetoSchema = new mongoose.Schema({
    origen: {
        type: String,
        enum: ['N', 'I'], // Nacional / Importado
        required: false,
    },
    codigo: {
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
    categoria: {
        type: String,
        required: false,
    },
    antiguedad: {
        type: Number,
        required: false,
    },
    pais_origen: {
        type: String,
        required: false,
    },
    tipo_objeto: {
        type: String,
        required: false,
    },
    condicion: {
        type: String,
        required: false,
    },
    estado_conservacion: {
        type: String,
        required: false,
    },
    clasificacion: {
        type: String,
        required: false,
    },
    ubicacion_actual: {
        type: String,
        required: false,
    },
    ultimo_lugar_conocido: {
        type: String,
        required: false,
    },
    fecha_registro: {
        type: String,
        required: false,
    },
    hora_registro: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: props => `${props.value} no es una hora válida en formato 24:00hs (hh:mm)!`
        }
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
    timestamps: true,
    strict: false,
});

// ✅ Índices optimizados
ObjetoSchema.index({ estado_registro: 1 });
ObjetoSchema.index({ nombre: 'text' });
ObjetoSchema.index({ codigo: 1 });
ObjetoSchema.index({ fecha_registro: -1 });
ObjetoSchema.index({ etiqueta: 1 });
ObjetoSchema.index({ estado_registro: 1, fecha_registro: -1 });
ObjetoSchema.index({ ultimo_lugar_conocido: 1 });

// ✅ Exportar modelo - usa colección 'Desaparecido' para compatibilidad con DB existente
export const Objeto = mongoose.models.Desaparecido ||
    mongoose.model('Desaparecido', ObjetoSchema);

// ✅ Backward compatibility alias
export const Desaparecido = Objeto;
