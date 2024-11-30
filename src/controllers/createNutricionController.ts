import {
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import { ValidationError } from '../errors/validationError.ts';

import { CreateNutricionService } from '../services/createNutricionService.ts';

export interface DataProps {
  name: string,
  weight: string,
  height: string,
  age: string,
  gender: string,
  objective: string,
  level: string
}

class CreateNutricionController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        name,
        weight,
        height,
        age,
        gender,
        objective,
        level,
      } = request.body as DataProps;

      if (!name || !weight || !height || !age || !gender || !objective || !level) {
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
