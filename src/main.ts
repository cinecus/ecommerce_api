import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware'
import { HttpExceptionFilter } from './execption';
import Debug from 'debug'
import * as cookieParser from 'cookie-parser';
import cors from 'cors'

Debug.enable('debugging:*')
const debug = Debug('debugging:running')

async function bootstrap() {
  const port = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule)
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.enableCors({
    credentials:true,
    origin:process.env.FRONTEND_URI
  });
  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,//ไม่ให้ field แปลกปลอมเข้ามาใน request 
      exceptionFactory: (errors) => {
        const errorMessages = errors.reduce((prev, cur) => [...prev, ...Object.values(cur.constraints).map(el => el)], [])  //ส่ง Validate Request ที่ error
        return new BadRequestException(errorMessages);
      }
    }
  ))
  app.use(logger)

  await app.listen(port, () => {
    debug('server is running port', port)
  });
}
bootstrap();
