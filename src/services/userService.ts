import { ValidationError } from '../errors/validationError.ts';
import { NotFoundError } from '../errors/notFoundError.ts';

import db from '../../db.ts';
import { User, UserUpdate } from '../models/users.ts';

/* interface UpdatedData {
  userName?: string;

} */

class UserService {
  static async getUser(filter = {}) {
    try {
      const result = await db('users')
        .where(filter)
        .select([
          'id',
          'email',
          'name',
          'active',
          'created_at',
          'updated_at',
        ])
        .first();

      return result as User | null;
    } catch (err) {
      throw err;
    }
  }

  static async getAllUsers() {
    try {
      const result = await db('users')
        .select([
          'id',
          'name',
          'email',
          'active',
          'created_at',
          'updated_at',
        ]);
      return result;
    } catch (err) {
      throw err;
    }
  }

  static async findUserLogin(filter = {}) {
    try {
      const result = await db('users').where(filter).first();
      if (!result) {
        throw new NotFoundError('Utilizador nao encontrado');
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  static async createUser({
    email, passwordHash, name,
  }) {
    try {
      const user = {
        email,
        password: passwordHash,
        name,
      };

      const userInBd = await this.getUser({ userName: user.email });

      if (userInBd) {
        throw new ValidationError(
          'Já existe um utilizador com esse username',
        );
      }

      const [userId] = await db('users').insert(user).returning('id');

      return { data: { id: userId, ...user } };
    } catch (err) {
      throw err;
    }
  }

  static async updateUser(id: string, updatedData: UserUpdate) {
    try {
      const getUser = await this.getUser({ id });

      if (!getUser) {
        throw new NotFoundError('Utilizador nao encontrado');
      }

      if (Object.prototype.hasOwnProperty.call(updatedData, 'email')) {
        const { email } = updatedData;
        const userEmail = await this.getUser({ email });

        if (userEmail) {
          throw new ValidationError(
            'Esse email já está em uso.',
          );
        }
      }

      const userUpdate = await db('users')
        .where({ id })
        .update(updatedData)
        .returning([
          'id',
          'email',
          'name',
          'active',
          'created_at',
          'updated_at',
        ])
        .then(([user]: User[]) => {
          return user;
        });
      return { data: userUpdate[0] };
    } catch (err) {
      throw err;
    }
  }

  static async deteleUser({ id }) {
    try {
      const user = await this.getUser({ id });

      if (!user) {
        throw new NotFoundError('Utilizador nao encontrado');
      }

      const userDeleted = await db('users')
        .where({ id })
        .del();

      return userDeleted;
    } catch (err) {
      throw err;
    }
  }
}

export { UserService };
