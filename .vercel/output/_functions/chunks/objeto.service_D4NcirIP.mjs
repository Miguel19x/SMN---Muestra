import { Types } from 'mongoose';
import { O as Objeto } from './objeto_BtcWFCv2.mjs';
import { r as redis } from './redis_CYcAgJqj.mjs';

const ANTIGUEDAD_STAGES = {
  NUEVO: { min: 0, max: 1, label: "Nuevo" },
  RECIENTE: { min: 2, max: 5, label: "Reciente" },
  INTERMEDIO: { min: 6, max: 15, label: "Intermedio" },
  ANTIGUO: { min: 16, max: 30, label: "Antiguo" },
  MUY_ANTIGUO: { min: 31, max: 50, label: "Muy Antiguo" },
  HISTORICO: { min: 51, max: Infinity, label: "Histórico" }
};
class ObjetoService {
  /**
   * ✅ Cálculo de antigüedad con tabla lookup
   */
  getAntiguedadStage(antiguedad) {
    for (const [, stage] of Object.entries(ANTIGUEDAD_STAGES)) {
      if (antiguedad >= stage.min && antiguedad <= stage.max) {
        return stage.label;
      }
    }
    return "Desconocido";
  }
  /**
   * ✅ Estado de condición basado en antigüedad
   */
  getCondicionEstado(antiguedad) {
    if (antiguedad <= 5) return "Óptimo";
    if (antiguedad <= 15) return "Bueno";
    if (antiguedad <= 30) return "Regular";
    return "Requiere revisión";
  }
  /**
   * ✅ Crear objeto con lógica de etiquetas
   */
  async createObjeto(input) {
    const lastPending = await Objeto.findOne({ estado_registro: "pendiente" }).sort({ _id: -1 }).select("etiqueta").lean();
    const newEtiqueta = lastPending?.etiqueta === "blue" ? "green" : "blue";
    const objeto = new Objeto({
      ...input,
      etiqueta: newEtiqueta
    });
    await objeto.save();
    return objeto;
  }
  /**
   * ✅ Buscar registros con filtros
   */
  async findByEstado(estado_registro) {
    return Objeto.find({ estado_registro }).select("-__v").lean().exec();
  }
  /**
   * ✅ Obtener por ID público
   */
  async findByPublicId(publicId) {
    const internalId = this.decodePublicId(publicId);
    if (!Types.ObjectId.isValid(internalId)) {
      return null;
    }
    return Objeto.findById(internalId).lean();
  }
  /**
   * ✅ Actualizar estado
   */
  async updateEstado(id, newEstado) {
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
  async invalidateCache(estado) {
    const cacheKey = `objetos:${estado}`;
    await redis.del(cacheKey);
  }
  /**
   * ✅ Decode public ID
   */
  decodePublicId(publicId) {
    try {
      return Buffer.from(publicId, "base64url").toString("utf-8");
    } catch {
      return "";
    }
  }
  /**
   * ✅ Eliminar registro
   */
  async delete(id) {
    const result = await Objeto.findByIdAndDelete(id);
    if (result) {
      await Promise.all([
        this.invalidateCache("pendiente"),
        this.invalidateCache("aprobado"),
        this.invalidateCache("rechazado")
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
          _id: "$estado_registro",
          count: { $sum: 1 }
        }
      }
    ]);
    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  }
  // ✅ Backward-compat aliases
  getAgeStage(age) {
    return this.getAntiguedadStage(age);
  }
  getLegalCondition(age) {
    return this.getCondicionEstado(age);
  }
}

export { ObjetoService as O };
