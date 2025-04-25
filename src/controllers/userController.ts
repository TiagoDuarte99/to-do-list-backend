import { FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from '../errors/validationError.ts';
import { ForbiddenError } from '../errors/forbiddenError.ts';
import { NotFoundError } from '../errors/notFoundError.ts';

import { UserService } from '../services/userService.ts';
import {
  UserCreate,
  UserUpdate,
  User,
  PasswordUpdate,
} from '../models/users.ts';

import {
  isValidPassword,
  getPasswdHash,
  isValidEmail,
  comparePassword,
} from '../utils/index.ts';

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
      const { page = 1 } = request.query as { page: number };
      const { result, totalResults } = await UserService.getAllUsers(page);

      if (!result) {
        throw new NotFoundError('Utilizador nao encontrado');
      }
      return reply.send({ users: result, totalResults });
    } catch (err) {
      throw err;
    }
  }

  static async createUserController(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      const { password, name, email, confirmPassword } =
        request.body as UserCreate;

      if (!password || !name || !email || !confirmPassword) {
        throw new ValidationError(
          'Todos os campos são um atributo obrigatório',
        );
      }

      if (!isValidEmail(email)) {
        throw new ValidationError('Introduza um email válido');
      }

      const userInBd = await UserService.getUser({ email });

      if (userInBd) {
        throw new ValidationError('Já existe um utilizador com esse email');
      }

      if (!isValidPassword(password)) {
        throw new ValidationError(
          'A password deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um dígito e um caractere especial',
        );
      }

      if (password !== confirmPassword) {
        throw new ValidationError(
          'A password não corresponde à confirmação de password.',
        );
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

  static async updatePasswordController(
    request: FastifyRequest,
    reply: FastifyReply,
    user: User,
  ) {
    try {
      const { id } = request.params as { id: string };

      const { password, newPassword, confirmPassword } =
        request.body as PasswordUpdate;

      if (user.id.toString() !== id && user.id.toString() !== '1') {
        throw new ForbiddenError(
          'Não tem autorização para editar este utilizador.',
        );
      }

      if (!password || !newPassword || !confirmPassword) {
        throw new ValidationError(
          'Todos os campos são de preencimento obrigatório.',
        );
      }

      if (newPassword !== confirmPassword) {
        throw new ValidationError(
          'A senha não corresponde à confirmação de senha.',
        );
      }

      const getUser = await UserService.findUserLogin({ id });

      if (!getUser) {
        throw new NotFoundError('Utilizador nao encontrado');
      }

      const isPasswordValid = comparePassword(password, getUser.password);
      if (!isPasswordValid) {
        throw new ValidationError('Password antiga inválida');
      }

      let passwordHash: string | undefined;
      if (newPassword) {
        if (!isValidPassword(newPassword)) {
          throw new ValidationError(
            'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um dígito e um caractere especial',
          );
        }
        passwordHash = getPasswdHash(newPassword);
      }

      const updatedData = Object.fromEntries(
        Object.entries({ password: passwordHash }).filter(
          ([, value]) => value !== undefined,
        ),
      );

      if (Object.keys(updatedData).length === 0) {
        throw new ValidationError(
          'Nenhum campo válido foi enviado para atualização.',
        );
      }

      const updateSuccessful = await UserService.updatePassword(
        id,
        updatedData,
      );

      if (!updateSuccessful) {
        throw new ValidationError('Erro ao atualizar a senha.');
      }

      reply.send({ message: 'Password atualizada com sucesso' });
    } catch (err) {
      throw err;
    }
  }

  static async updateUserController(
    request: FastifyRequest,
    reply: FastifyReply,
    user: User,
  ) {
    try {
      const { id } = request.params as { id: string };

      const { name, email, active } = request.body as UserUpdate;

      if (user.id.toString() !== id && user.id.toString() !== '1') {
        throw new ForbiddenError(
          'Não tem autorização para editar este utilizador.',
        );
      }

      const updatedData = Object.fromEntries(
        Object.entries({ name, email, active }).filter(
          ([, value]) => value !== undefined,
        ),
      );

      if (Object.keys(updatedData).length === 0) {
        throw new ValidationError(
          'Nenhum campo válido foi enviado para atualização.',
        );
      }

      const getUser = await UserService.getUser({ id });

      if (!getUser) {
        throw new NotFoundError('Utilizador nao encontrado');
      }

      if (Object.prototype.hasOwnProperty.call(updatedData, 'email')) {
        const userEmail = await UserService.getUser({ email });

        if (userEmail) {
          throw new ValidationError('Esse email já está em uso.');
        }
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
      console.log(user.id.toString(), id);
      if (user.id.toString() !== id) {
        throw new ForbiddenError(
          'Não tem autorização para eliminar este utilizador.',
        );
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
