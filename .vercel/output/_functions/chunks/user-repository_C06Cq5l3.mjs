import { Types } from 'mongoose';
import { U as User } from './user_CWLeS9yw.mjs';
import bcrypt from 'bcrypt';

class Validation {
  static username(username) {
    if (typeof username !== "string") {
      throw new Error("El nombre de usuario debe ser una cadena de texto");
    }
    if (username.length < 3 || username.length > 20) {
      throw new Error("El nombre de usuario debe tener entre 3 y 20 caracteres");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error("El nombre de usuario solo puede contener letras, números y guiones bajos");
    }
  }
  static password(password) {
    if (typeof password !== "string") {
      throw new Error("La contraseña debe ser una cadena de texto");
    }
    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      throw new Error("La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial");
    }
  }
  static security_phrase(phrase) {
    if (typeof phrase !== "string") {
      throw new Error("La frase de seguridad debe ser una cadena de texto");
    }
    if (phrase.length < 5 || phrase.length > 50) {
      throw new Error("La frase de seguridad debe tener entre 5 y 50 caracteres");
    }
  }
}

const { ObjectId } = Types;
class UserRepository {
  async create({ username, password, security_phrase1, security_phrase2, security_phrase3, security_question1, security_question2, security_question3 }) {
    Validation.username(username);
    Validation.password(password);
    Validation.security_phrase(security_phrase1);
    Validation.security_phrase(security_phrase2);
    Validation.security_phrase(security_phrase3);
    const id = new ObjectId();
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedSecurity_phrase1 = await bcrypt.hash(security_phrase1, 12);
    const hashedSecurity_phrase2 = await bcrypt.hash(security_phrase2, 12);
    const hashedSecurity_phrase3 = await bcrypt.hash(security_phrase3, 12);
    const user = new User({
      _id: id,
      username,
      password: hashedPassword,
      security_phrase1: hashedSecurity_phrase1,
      security_phrase2: hashedSecurity_phrase2,
      security_phrase3: hashedSecurity_phrase3,
      security_question1,
      security_question2,
      security_question3
    });
    await user.save();
    const { password: _, security_phrase1: __, security_phrase2: ___, security_phrase3: ____, ...userWithoutSensitiveInfo } = user.toObject();
    return userWithoutSensitiveInfo;
  }
  async login({ username, password }) {
    Validation.username(username);
    Validation.password(password);
    const user = await User.findOne({ username });
    if (!user) throw new Error("El nombre de usuario no existe");
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("La contraseña es inválida");
    const questionNumber = this.getRandomSecurityPhraseNumber();
    const securityQuestion = user[`security_question${questionNumber}`];
    const { password: _, security_phrase1: __, security_phrase2: ___, security_phrase3: ____, ...userWithoutSensitiveInfo } = user.toObject();
    return { user: userWithoutSensitiveInfo, questionNumber, securityQuestion };
  }
  async verifySecurityPhrase(userId, phraseNumber, securityPhrase) {
    const user = await User.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");
    const phraseKey = `security_phrase${phraseNumber}`;
    const storedPhrase = user[phraseKey];
    if (!storedPhrase) throw new Error("Frase de seguridad no encontrada");
    return await bcrypt.compare(securityPhrase, storedPhrase);
  }
  async findByUsername(username) {
    const user = await User.findOne({ username });
    if (!user) return null;
    const { password: _, security_phrase1: __, security_phrase2: ___, security_phrase3: ____, ...userWithoutSensitiveInfo } = user.toObject();
    return userWithoutSensitiveInfo;
  }
  async findById(id) {
    return await User.findById(id);
  }
  getRandomSecurityPhraseNumber() {
    return Math.floor(Math.random() * 3) + 1;
  }
}

export { UserRepository as U };
