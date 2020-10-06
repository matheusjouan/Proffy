import { Request, Response } from 'express';

import { getRepository, getConnection } from 'typeorm';

import User from '../models/User';
import Leasson from '../models/Leasson';
import LeassonSchedule from '../models/LeassonSchedule';

import ConvertHourToMinutes from '../utils/ConvertHourToMinutes';

interface ScheduleItem {
  week_day: number;
  to: string;
  from: string;
}

class LeassonsController {
  public async create(req: Request, res: Response) {
    try {
      const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        price,
        schedule,
      } = req.body;
      // Transaction => TypeORM
      const newLeasson = await getConnection().transaction(
        async transactionalEntityManager => {
          const user = transactionalEntityManager.create(User, {
            name,
            avatar,
            whatsapp,
            bio,
          });

          await transactionalEntityManager.save(user);

          const leasson = transactionalEntityManager.create(Leasson, {
            user,
            subject,
            price,
          });

          await transactionalEntityManager.save(leasson);

          // Convertion hour to minutes
          const leassonScheduleParsed = schedule.map((item: ScheduleItem) => ({
            ...item,
            from: ConvertHourToMinutes(item.from),
            to: ConvertHourToMinutes(item.to),
            leasson,
          }));

          const leassonSchedule = transactionalEntityManager.create(
            LeassonSchedule,
            leassonScheduleParsed,
          );

          await transactionalEntityManager.save(leassonSchedule);

          const userCreated = await transactionalEntityManager.findOne(
            User,
            user.id,
            {
              relations: ['leassons', 'leassons.leassonSchedule'],
            },
          );

          // Retorna todos os dados criados, buscando o User
          return userCreated;
        },
      );

      return res.status(201).json(newLeasson);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async index(req: Request, res: Response) {
    try {
      const { week_day, subject, time } = req.query;

      let timeInMinutes = undefined;

      const lessonsRepository = getRepository(Leasson);

      // Junção das tabelas
      const query = await lessonsRepository
        .createQueryBuilder('leasson')
        .leftJoinAndSelect('leasson.user', 'user')
        .leftJoinAndSelect('leasson.leassonSchedule', 'leassonSchedule');

      // Criação do relacionamento para realizar subquery (pesquisa)
      const subQuery = query
        .subQuery()
        .select('leasson_schedule.*')
        .from(LeassonSchedule, 'leasson_schedule')
        .where('leasson_schedule.leasson_id = leasson.id');

      // Caso o filtro do horário seja preenchido
      if (time) {
        timeInMinutes = ConvertHourToMinutes(time as string);

        subQuery
          .andWhere('leassonSchedule.from <= :timeInMinutes')
          .andWhere('leassonSchedule.to > :timeInMinutes');
      }

      // Caso o filtro do dia da semana seja preenchido
      if (week_day || Number(week_day) === 0) {
        subQuery.andWhere('leassonSchedule.week_day = :week_day');
      }

      // Caso possuir a subquery, trazer
      query.where(`exists ${subQuery.getSql()}`);

      // Adição do filtro de Matéria no final da query
      if (subject) {
        query.andWhere('subject = :subject');
      }

      // Passa-se todos os parâmetros utilizado nas query/subquery
      const leassons = await query
        .setParameters({ subject, timeInMinutes, week_day })
        .getMany();

      return res.json(leassons);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default LeassonsController;
