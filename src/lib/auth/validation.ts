export class Validation {
  static username(username: string): void {
    if (typeof username !== 'string') {
      throw new Error('El nombre de usuario debe ser una cadena de texto');
    }
    if (username.length < 3 || username.length > 20) {
      throw new Error('El nombre de usuario debe tener entre 3 y 20 caracteres');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error('El nombre de usuario solo puede contener letras, números y guiones bajos');
    }
  }

  static password(password: string): void {
    if (typeof password !== 'string') {
      throw new Error('La contraseña debe ser una cadena de texto');
    }
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial');
    }
  }

  static security_phrase(phrase: string): void {
    if (typeof phrase !== 'string') {
      throw new Error('La frase de seguridad debe ser una cadena de texto');
    }
    if (phrase.length < 5 || phrase.length > 50) {
      throw new Error('La frase de seguridad debe tener entre 5 y 50 caracteres');
    }
  }
}