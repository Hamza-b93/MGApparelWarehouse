import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuttingController } from './cutting.controller';
import { CuttingService } from './cutting.service';
import OrmConfig from '../../ormconfig.json';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: <any>String(OrmConfig.type) || 'mssql',
      host: OrmConfig.host,
      port: OrmConfig.port,
      username: OrmConfig.username,
      password: OrmConfig.password,
      database: OrmConfig.database,
      entities: OrmConfig.entities,
      migrations: OrmConfig.migrations,
      subscribers: OrmConfig.subscribers,
      cli: OrmConfig.cli,
      encrypt: OrmConfig.encrypt,
      logging: OrmConfig.logging,
      logger: 'file',
      synchronize: OrmConfig.synchronize,
      maxQueryExecutionTime: 5000, // logs all queries which exceed 5s to execute.
      cache: true,
      pool: {
        max: 1000, // max no of connections in a pool available for transaction at anytime.
        min: 25, // minimum no of connections present at any time.
        acquireTimeoutMillis: 15000, // max (ms) wait for a resource to acquire lock otherwise timeout.
        maxWaitingClients: 250, // max no of requests in queue. rest will be discarded.
      },
      options: {
        abortTransactionOnError: true,
        isolation: 'READ_COMMITTED',
        connectionIsolationLevel: 'REPEATABLE_READ',
      },
    }),
  ],
  providers: [CuttingService],
  controllers: [CuttingController],
})
export class CuttingModule {}
