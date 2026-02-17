import mongoose from "mongoose";

const removalRequestSchema = new mongoose.Schema({
    // Referencia al registro de desaparecido
    desaparecido_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Desaparecido',
        required: true
    },

    // Información del solicitante (opcional - para solicitudes anónimas)
    twitter_user_id: { type: String, default: 'anonymous' },
    twitter_username: { type: String, default: 'anonymous' },
    twitter_name: { type: String, default: 'Anónimo' },
    requester_email: { type: String }, // Email opcional para contacto

    // Razón y evidencia
    reason: { type: String, required: true, maxlength: 1000 },
    evidence_url: { type: String },

    // Estado de la solicitud
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    // Fecha límite para procesamiento (7 días desde creación)
    deadline: { type: Date },

    // Notas del admin
    admin_notes: { type: String },
    processed_by: { type: String },
    processed_at: { type: Date },
}, {
    timestamps: true
});

// Índices para búsquedas eficientes
removalRequestSchema.index({ status: 1 });
removalRequestSchema.index({ desaparecido_id: 1 });
removalRequestSchema.index({ deadline: 1 });
removalRequestSchema.index({ createdAt: -1 });

// Middleware para establecer deadline automáticamente
removalRequestSchema.pre('save', async function () {
    if (this.isNew && !this.deadline) {
        // Establecer deadline a 7 días desde la creación
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 7);
        this.deadline = deadline;
    }
});

export const RemovalRequest = mongoose.models.RemovalRequest || mongoose.model('RemovalRequest', removalRequestSchema);
