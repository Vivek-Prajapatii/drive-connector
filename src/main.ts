import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import bodyParser from 'body-parser';

import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.use(
    cors({
      origin: 'http://localhost:3000', // Replace with the origin of your client application
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true, // Set to true if your requests include credentials (cookies, HTTP authentication)
    }),
  );
  app.use(bodyParser.json());
  await app.listen(5000);
}
bootstrap();
