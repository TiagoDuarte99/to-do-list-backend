import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

import { authMiddleware } from '../middlewares/passaport.ts';
import { UserController } from '../controllers/userController.ts';
import { User } from '../models/users.ts';

export async function userRoutes(fastify: FastifyInstance/*  options: FastifyPluginOptions */) {
  fastify.post('/creatUser', async (request: FastifyRequest, reply: FastifyReply) => {
    return UserController.createUserController(request, reply);
  });

  fastify.get('/findOneUser', async (request: FastifyRequest, reply: FastifyReply) => {
    return UserController.getUser(request, reply);
  });

  fastify.get('/findUsers', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    return UserController.getAllUsers(request, reply);
  });

  fastify.patch('/updateUser/:id', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userAuths = request.user as User;
    return UserController.updateUserController(request, reply, userAuths);
  });

  fastify.delete('/deleteUser/:id', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userAuths = request.user as User;
    return UserController.deleteUserController(request, reply, userAuths);
  });
}
