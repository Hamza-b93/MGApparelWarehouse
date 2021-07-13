import { CuttingController } from './cutting/cutting.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorsList } from './entity/models/ErrorsList';
import { LoggerMiddleware } from './middlewares/logger';
import { ReportsModule } from './reports/reports.module';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsModule } from './transactions/transactions.module';
import { CuttingModule } from './cutting/cutting.module';

@Module({
  imports: [ReportsModule, TransactionsModule, ErrorsList, CuttingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(TransactionsController, CuttingController);
  }
}
