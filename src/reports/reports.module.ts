import OrmConfig from '../../ormconfig.json';
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      synchronize: OrmConfig.synchronize,
    }),
    TypeOrmModule.forFeature([]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
