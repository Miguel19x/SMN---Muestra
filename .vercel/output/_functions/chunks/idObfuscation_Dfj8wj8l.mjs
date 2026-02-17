import crypto from 'crypto';
import { S as SECURITY_CONFIG } from './app.config_BO63yO4S.mjs';

const SECRET_SALT = process.env.ID_SECRET || SECURITY_CONFIG.PUBLIC_ID.SALT;
function createPublicId(mongoId) {
  const hmac = crypto.createHmac("sha256", SECRET_SALT).update(mongoId).digest("base64url");
  const timestamp = Date.now().toString(36);
  const publicId = `${hmac.substring(0, 16)}${timestamp}`;
  return Buffer.from(publicId).toString("base64url");
}
class PublicIdMapper {
  constructor() {
    this.cacheMap = /* @__PURE__ */ new Map();
    this.reverseMap = /* @__PURE__ */ new Map();
  }
  /**
   * Registrar un mapeo
   */
  register(mongoId, publicId) {
    this.cacheMap.set(publicId, mongoId);
    this.reverseMap.set(mongoId, publicId);
  }
  /**
   * Obtener MongoDB ID desde public ID
   */
  getMongoId(publicId) {
    return this.cacheMap.get(publicId);
  }
  /**
   * Obtener public ID desde MongoDB ID
   */
  getPublicId(mongoId) {
    return this.reverseMap.get(mongoId);
  }
  /**
   * Crear y registrar public ID
   */
  createAndRegister(mongoId) {
    const existing = this.reverseMap.get(mongoId);
    if (existing) return existing;
    const publicId = createPublicId(mongoId);
    this.register(mongoId, publicId);
    return publicId;
  }
  /**
   * Limpiar cache (para testing)
   */
  clear() {
    this.cacheMap.clear();
    this.reverseMap.clear();
  }
}
const publicIdMapper = new PublicIdMapper();

export { PublicIdMapper, createPublicId, publicIdMapper };
