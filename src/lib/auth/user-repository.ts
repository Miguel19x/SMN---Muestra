import { Types } from 'mongoose';
import { User } from '../../models/user';
import { Validation } from './validation';
import bcrypt from 'bcrypt';

const { ObjectId } = Types;

interface IUser {
  _id?: typeof ObjectId;
  username: string;
  password: string;
  security_phrase1: string;
  security_phrase2: string;
  security_phrase3: string;
  security_question1: string;
  security_question2: string;
  security_question3: string;
}

type UserWithoutSensitiveInfo = Omit<IUser, 'password' | 'security_phrase1' | 'security_phrase2' | 'security_phrase3'>;

interface IUserRepository {
  create(user: Omit<IUser, '_id'>): Promise<UserWithoutSensitiveInfo>;
  login(credentials: { username: string; password: string }): Promise<{ user: UserWithoutSensitiveInfo, questionNumber: number, securityQuestion: string } | null>;
  verifySecurityPhrase(userId: typeof ObjectId, phraseNumber: number, securityPhrase: string): Promise<boolean>;
  findByUsername(username: string): Promise<UserWithoutSensitiveInfo | null>;
  findById(id: typeof ObjectId): Promise<IUser | null>;
  getRandomSecurityPhraseNumber(): number;
}

export class UserRepository implements IUserRepository {
  async create({ username, password, security_phrase1, security_phrase2, security_phrase3, security_question1, security_question2, security_question3 }: Omit<IUser, '_id'>): Promise<UserWithoutSensitiveInfo> {
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

  async login({ username, password }: { username: string; password: string }): Promise<{ user: UserWithoutSensitiveInfo, questionNumber: number, securityQuestion: string } | null> {
    Validation.username(username);
    Validation.password(password);

    const user = await User.findOne({ username });
    if (!user) throw new Error('El nombre de usuario no existe');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('La contraseña es inválida');

    const questionNumber = this.getRandomSecurityPhraseNumber();
    const securityQuestion = user[`security_question${questionNumber}`];
    const { password: _, security_phrase1: __, security_phrase2: ___, security_phrase3: ____, ...userWithoutSensitiveInfo } = user.toObject();
    return { user: userWithoutSensitiveInfo, questionNumber, securityQuestion };
  }

  async verifySecurityPhrase(userId: typeof ObjectId, phraseNumber: number, securityPhrase: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
  
    const phraseKey = `security_phrase${phraseNumber}` as keyof IUser;
    const storedPhrase = user[phraseKey];
    if (!storedPhrase) throw new Error('Frase de seguridad no encontrada');
  
    return await bcrypt.compare(securityPhrase, storedPhrase);
  }

  async findByUsername(username: string): Promise<UserWithoutSensitiveInfo | null> {
    const user = await User.findOne({ username });
    if (!user) return null;
    const { password: _, security_phrase1: __, security_phrase2: ___, security_phrase3: ____, ...userWithoutSensitiveInfo } = user.toObject();
    return userWithoutSensitiveInfo;
  }

  async findById(id: typeof ObjectId): Promise<IUser | null> {
    return await User.findById(id);
  }

  getRandomSecurityPhraseNumber(): number {
    return Math.floor(Math.random() * 3) + 1;
  }
}