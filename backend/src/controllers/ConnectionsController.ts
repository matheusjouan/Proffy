import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Connection from '../models/Conntection';

class ConnectionsController {
  async index(req: Request, res: Response) {
    const userRepository = getRepository(Connection);

    const totalConnection = await userRepository.count();

    return res.json({ totalConnection });
  }

  async create(req: Request, res: Response) {
    const { user_id } = req.body;

    const connectionsRepository = getRepository(Connection);

    const connection = connectionsRepository.create({
      user: user_id,
    });

    await connectionsRepository.save(connection);

    return res.status(201).send();
  }
}

export default ConnectionsController;
