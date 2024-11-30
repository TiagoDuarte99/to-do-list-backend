import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

import { ValidationError } from '../errors/validationError.ts';
import { User } from '../models/users.ts';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    let { token } = request.headers;

    if (!token) {
      throw new ValidationError('Não autorizado falta token');
    }

    if (Array.isArray(token)) {
      [token] = token;
    }

    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY!);
      request.user = decoded;
    } catch (err) {
      throw new ValidationError(`Token expirado ${err}`);
    }
    return { ok: true };
  } catch (err) {
    return reply.status(401).send({ message: err.message, status: err.status });
  }
}
