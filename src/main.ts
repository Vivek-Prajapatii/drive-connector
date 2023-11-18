import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';

import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.use(cors());
  await app.listen(5000);
}
bootstrap();
