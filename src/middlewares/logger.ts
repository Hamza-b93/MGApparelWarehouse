import { NestMiddleware } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { EntityManager } from 'typeorm';
import { ApplicationLog } from '../entity/models/ApplicationLog';

export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectEntityManager()
    public readonly entityManager: EntityManager,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.entityManager.insert(ApplicationLog, [
      {
        requestIpAddr: req.socket.remoteAddress,
        requestBody: JSON.stringify(req.body),
        requestType: req.method,
        requestApi: req.path,
      },
    ]);
    next();
  }
}
