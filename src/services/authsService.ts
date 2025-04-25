import jwt from 'jsonwebtoken';
import { ValidationError } from '../errors/validationError.ts';
import { UserService } from './userService.ts';
import { UserAuths } from '../models/users.ts';
import { comparePassword } from '../utils/index.ts';

const expiresIn = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
class AuthService {
  static async login({ email, password }: UserAuths) {
    try {
      const user = await UserService.findUserLogin({ email });

      if (!user) {
        throw new ValidationError('Utilizador não encontrado');
      }

      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new ValidationError('Erro na autenticação');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...userWithoutPassword } = user;

      const privateKey = process.env.PRIVATE_KEY!;
      const token = jwt.sign(userWithoutPassword, privateKey, {
        algorithm: 'HS256',
        expiresIn,
      });

      return { token, userWithoutPassword };
    } catch (err) {
      throw err;
    }
  }
}

export { AuthService };
