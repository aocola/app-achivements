import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { getPort } from './common/utils/common-functions';

const logger = new Logger('ServerMain-BackendService');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const portHTTP = getPort(process.env.HTTP_PORT, "HTTP");

  app.enableCors({
    origin: 'http://localhost:3000', // Dominio del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Si necesitas enviar cookies o headers de autenticación
  });
  
  await app.listen(portHTTP, () => {
    console.log(`BackendService HTTP server is listening on port ${portHTTP}`);
  });
}

dotenv.config();
bootstrap();
