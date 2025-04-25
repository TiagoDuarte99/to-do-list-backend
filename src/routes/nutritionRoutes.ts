import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

import { authMiddleware } from '../middlewares/passaport.ts';
import { CreateNutricionController } from '../controllers/createNutricionController.ts';

export async function nutritionRoutes(fastify: FastifyInstance) {

  fastify.post('/createNutrition', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    return CreateNutricionController.createNutrition(request, reply);
  });
}
