import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../errors/validationError.ts';
import { UserService } from './userService.ts';
import { AuthController } from '../controllers/authsController.ts';
import { UserAuths } from '../models/users.ts';


const expiresIn = '24h';
class AuthService {
  static async login({ email, password }: UserAuths) {
    try {
      const user = await UserService.findUserLogin({ email });

      if (!user) {
        throw new ValidationError('Utilizador não encontrado');
      }

/*       const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new ValidationError('Erro na autenticação');
      } */

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: userPassword, ...userWithoutPassword } = user;
      // TODO erro no userPassword

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
