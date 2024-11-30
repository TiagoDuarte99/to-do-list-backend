import { FastifyInstance } from 'fastify';
import { userRoutes } from './routes/userRoutes.ts';
import { nutritionRoutes } from './routes/nutritionRoutes.ts';
import { authsRoutes } from './routes/authsRoutes.ts';

export async function routes(fastify: FastifyInstance) {
  fastify.register(authsRoutes);

  fastify.register(userRoutes); // Rotas de usuários
  fastify.register(nutritionRoutes); // Rotas de nutrição
}
