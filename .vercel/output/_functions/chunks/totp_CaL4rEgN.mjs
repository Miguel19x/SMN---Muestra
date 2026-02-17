import { authenticator } from 'otplib';
import QRCode from 'qrcode';

authenticator.options = {
  digits: 6,
  step: 30,
  // 30 segundos por código
  window: 1
  // Permite códigos del período anterior/siguiente
};
function generateSecret() {
  return authenticator.generateSecret();
}
function generateOtpAuthUrl(username, secret, issuer = "NoMasSecuestros") {
  return authenticator.keyuri(username, issuer, secret);
}
async function generateQRCode(otpauthUrl) {
  try {
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 256,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("No se pudo generar el código QR");
  }
}
function verifyToken(token, secret) {
  try {
    const cleanToken = token.replace(/\s/g, "");
    if (!/^\d{6}$/.test(cleanToken)) {
      return false;
    }
    return authenticator.verify({ token: cleanToken, secret });
  } catch (error) {
    console.error("Error verifying TOTP:", error);
    return false;
  }
}
async function setup2FA(username) {
  const secret = generateSecret();
  const otpauthUrl = generateOtpAuthUrl(username, secret);
  const qrCode = await generateQRCode(otpauthUrl);
  return {
    secret,
    qrCode,
    otpauthUrl
  };
}

export { setup2FA as s, verifyToken as v };
