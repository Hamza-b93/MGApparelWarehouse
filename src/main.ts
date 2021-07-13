import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import OrmConfig from '../ormconfig.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // allow file upload of size upto 50mbs.
  app.use(
    json({
      limit: '50mb',
    }),
  );
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // validation pipes allowed globally.
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  // enable cors policy to access from outside domains.
  app.enableCors();
  await app.listen(OrmConfig.app_port);
}
bootstrap();
