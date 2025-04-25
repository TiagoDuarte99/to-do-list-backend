import { NotFoundError } from '../errors/notFoundError.ts';

import db from '../../db.ts';
import { User, UserUpdate } from '../models/users.ts';

class UserService {
  static async getUser(filter = {}) {
    try {
      const result = await db('users')
        .where(filter)
        .select(['id', 'email', 'name', 'active', 'created_at', 'updated_at'])
        .first();

      return result as User | null;
    } catch (err) {
      throw err;
    }
  }
  // TODO Modar os erros para os meus erros

  static async getAllUsers(page: number) {
    try {
      const limit = 10;
      const offset = (page - 1) * limit;

      const result = await db('users')
        .select(['id', 'name', 'email', 'active', 'created_at', 'updated_at'])
        .limit(limit)
        .offset(offset)
        .orderBy('id');

      const totalCount = await db('users').count('id').first();
      const totalResults = totalCount
        ? parseInt(totalCount.count as string, 10)
        : 0;

      return { result, totalResults };
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

  static async createUser({ email, passwordHash, name }) {
    try {
      const user = {
        email,
        password: passwordHash,
        name,
      };

      const [createdUser] = await db('users')
        .insert(user)
        .returning(['id', 'email', 'name']);

      return createdUser;
    } catch (err) {
      throw err;
    }
  }

  static async updatePassword(
    id: string,
    updatedData: UserUpdate,
  ): Promise<boolean> {
    try {
      const result = await db('users').where({ id }).update(updatedData);

      return result > 0;
    } catch (err) {
      throw err;
    }
  }

  static async updateUser(id: string, updatedData: UserUpdate) {
    try {
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
        ]);
      return userUpdate[0];
    } catch (err) {
      throw err;
    }
  }

  static async deteleUser({ id }) {
    try {
      const userDeleted = await db('users')
        .where({ id })
        .update({ active: false });

      return userDeleted;
    } catch (err) {
      throw err;
    }
  }
}

export { UserService };
