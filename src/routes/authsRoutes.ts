import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

import { AuthController } from '../controllers/authsController.ts';

export async function authsRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    return AuthController.login(request, reply); // Chamada direta ao método estático
  });
}
