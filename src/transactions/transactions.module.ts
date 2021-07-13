import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      logging: ['error'],
      logger: 'file',
      synchronize: OrmConfig.synchronize,
      maxQueryExecutionTime: 1000, // logs all queries which exceed 5s to execute.
      cache: true,
      pool: {
        max: 1000, // max no of connections in a pool available for transaction at anytime.
        min: 25, // minimum no of connections present at any time.
        acquireTimeoutMillis: 35000, // max (ms) wait for a resource to acquire lock otherwise timeout.
        maxWaitingClients: 1500, // max no of requests in queue. rest will be discarded.
      },
      options: {
        abortTransactionOnError: true,
        isolation: 'READ_COMMITTED',
        connectionIsolationLevel: 'REPEATABLE_READ',
      },
    }),
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
