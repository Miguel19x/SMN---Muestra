import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  security_phrase1: { type: String, required: true },
  security_phrase2: { type: String, required: true },
  security_phrase3: { type: String, required: true },
  security_question1: { type: String, required: true },
  security_question2: { type: String, required: true },
  security_question3: { type: String, required: true },
  // Campos para 2FA
  totp_secret: { type: String, required: false },
  totp_enabled: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);