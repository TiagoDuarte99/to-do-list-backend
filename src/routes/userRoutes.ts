import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from 'fastify';

import { authMiddleware } from '../middlewares/passaport.ts';
import { UserController } from '../controllers/userController.ts';
import { User } from '../models/users.ts';

export async function userRoutes(fastify: FastifyInstance/*  options: FastifyPluginOptions */) {
  fastify.post('/create-user', async (request: FastifyRequest, reply: FastifyReply) => {
    return UserController.createUserController(request, reply);
  });

  fastify.get('/find-one-user', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    return UserController.getUser(request, reply);
  });

  fastify.get('/find-users', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { users, totalResults } = await UserController.getAllUsers(request, reply);
    reply.header('X-Total-Count', totalResults);
    reply.send({ users });
  });

  fastify.put('/update-password/:id', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userAuths = request.user as User;
    return UserController.updatePasswordController(request, reply, userAuths);
  });

  fastify.patch('/update-user/:id', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userAuths = request.user as User;
    return UserController.updateUserController(request, reply, userAuths);
  });

  fastify.delete('/delete-user/:id', { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userAuths = request.user as User;
    return UserController.deleteUserController(request, reply, userAuths);
  });
}
