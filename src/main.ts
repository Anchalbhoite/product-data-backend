import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // automatically converts payload to the correct types
    }),
  );
  // Enable CORS for your frontend (port 5173)
  app.enableCors({
    origin: 'http://localhost:5173', // your frontend dev server
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
