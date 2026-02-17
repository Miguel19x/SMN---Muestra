import mongoose from 'mongoose';

const desaparecidoSchema = new mongoose.Schema({
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
});

// Índices para optimizar búsquedas frecuentes
desaparecidoSchema.index({ estado_registro: 1 });
desaparecidoSchema.index({ nombre: 'text' });
desaparecidoSchema.index({ cedula: 1 });
desaparecidoSchema.index({ fecha: -1 });
desaparecidoSchema.index({ etiqueta: 1 });

const Desaparecido = mongoose.models.Desaparecido || mongoose.model('Desaparecido', desaparecidoSchema);

export { Desaparecido as D };
