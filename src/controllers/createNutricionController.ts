import { FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from '../errors/validationError.ts';

import { CreateNutricionService } from '../services/createNutricionService.ts';
import { Nutrition } from '../models/nutrition.ts';

class CreateNutricionController {
  static async createNutrition(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, weight, height, age, gender, objective, level } =
        request.body as Nutrition;

      if (
        !name ||
        !weight ||
        !height ||
        !age ||
        !gender ||
        !objective ||
        !level
      ) {
        throw new ValidationError(
          'Todos os campos são um atributo obrigatório',
        );
      }

      const nutricion = await CreateNutricionService.execute({
        name,
        weight,
        height,
        age,
        gender,
        objective,
        level,
      });

      reply.send(nutricion);
    } catch (err) {
      throw err;
    }
  }
}

export { CreateNutricionController };
