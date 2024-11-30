import {
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import { ValidationError } from '../errors/validationError.ts';
import { ForbiddenError } from '../errors/forbiddenError.ts';
import { NotFoundError } from '../errors/notFoundError.ts';

import { UserService } from '../services/userService.ts';
import { UserCreate, UserUpdate, User } from '../models/users.ts';
import { isValidPassword, getPasswdHash } from '../utils/index.ts';

class UserController {
  static async getUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const filter = request.query!;
      const user = await UserService.getUser(filter);
      if (!user) {
        throw new NotFoundError('Utilizador nao encontrado');
      }

      return reply.send(user);
    } catch (err) {
      throw err;
    }
  }

  static async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await UserService.getAllUsers();
      if (!user) {
        throw new NotFoundError('Utilizador nao encontrado');
      }

      return reply.send(user);
    } catch (err) {
      throw err;
    }
  }

  static async createUserController(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        password,
        name,
        email,
        confirmPassword,
      } = request.body as UserCreate;

      if (!password || !name || !email || !confirmPassword) {
        throw new ValidationError(
          'Todos os campos são um atributo obrigatório',
        );
      }

      if (!isValidPassword(password)) {
        throw new ValidationError('A password deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um dígito e um caractere especial');
      }
      if (password !== confirmPassword) {
        throw new ValidationError('A password não corresponde à confirmação de password.');
      }

      const passwordHash = getPasswdHash(password);

      const user = await UserService.createUser({
        name,
        passwordHash,
        email,
      });

      reply.send({ user, message: 'Utilizador criado com sucesso' });
    } catch (err) {
      throw err;
    }
  }

  /* UpdatePassword fazer logica para isto */

  static async updateUserController(
    request: FastifyRequest,
    reply: FastifyReply,
    user: User,
  ) {
    try {
      const { id } = request.params as { id: string };

      const {
        name,
        email,
        active,
      } = request.body as UserUpdate;

      if (user.id.toString() !== id) {
        throw new ForbiddenError('Não tem autorização para editar este utilizador.');
      }

      /*       let passwordHash: string | undefined;
            if (password) {
              if (!isValidPassword(password)) {
throw new ValidationError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula,
uma minúscula, um dígito e um caractere especial');
              }
              passwordHash = getPasswdHash(password);
            }

            if (password && confirmPassword && password !== confirmPassword) {
              throw new ValidationError('A senha não corresponde à confirmação de senha.');
            } */

      const updatedData = Object.fromEntries(
        Object.entries({ name, email, active }).filter(([, value]) => value !== undefined),
      );

      if (Object.keys(updatedData).length === 0) {
        throw new ValidationError('Nenhum campo válido foi enviado para atualização.');
      }

      const updatedUser = await UserService.updateUser(id, updatedData);

      reply.send({ updatedUser, message: 'Utilizador Atualizado com sucesso' });
    } catch (err) {
      throw err;
    }
  }

  static async deleteUserController(
    request: FastifyRequest,
    reply: FastifyReply,
    user: User,
  ) {
    try {
      const { id } = request.params as { id: string };

      if (user.id.toString() !== id) {
        throw new ForbiddenError('Não tem autorização para eliminar este utilizador.');
      }

      const userDeleted = await UserService.deteleUser({ id });

      if (userDeleted) {
        reply.send('Utilizador eliminado com sucesso');
      }
    } catch (err) {
      throw err;
    }
  }
}

export { UserController };
