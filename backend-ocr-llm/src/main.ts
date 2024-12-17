import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,POST,PUT,DELETE,PATCH,OPTIONS',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 4200);
}
bootstrap();
