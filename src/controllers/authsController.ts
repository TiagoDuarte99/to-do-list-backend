import { FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from '../errors/validationError.ts';
import { AuthService } from '../services/authsService.ts';
import { UserAuths } from '../models/users.ts';

class AuthController {
  static async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as UserAuths;

      if (!email || !password) {
        throw new ValidationError(
          'Todos os campos são um atributo obrigatório',
        );
      }

      const { token, userWithoutPassword } = await AuthService.login({
        email,
        password,
      });

      return reply.send({ payload: userWithoutPassword, token });
    } catch (err) {
      throw err;
    }
  }
}

export { AuthController };
