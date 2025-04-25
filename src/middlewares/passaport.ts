import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

import { ValidationError } from '../errors/validationError.ts';
import { User } from '../models/users.ts';

declare module 'fastify' {
  // eslint-disable-next-line no-shadow
  interface FastifyRequest {
    user?: User;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { authorization } = request.headers;

    if (!authorization) {
      throw new ValidationError('Não autorizado: falta o token');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new ValidationError('Formato de token inválido');
    }

    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY!) as User;
      request.user = decoded;
    } catch (err) {
      throw new ValidationError(`Token expirado: ${err?.message || err}`);
    }
    return { ok: true };
  } catch (err) {
    return reply.status(401).send({ message: err.message, status: err.status });
  }
}
