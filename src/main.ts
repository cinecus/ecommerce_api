import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './execption';
import * as cookieParser from 'cookie-parser';


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

  await app.listen(port, () => {
    let logger = new Logger('START');
    logger.debug(`server is listening on port ${port}`)
  });
}
bootstrap();
