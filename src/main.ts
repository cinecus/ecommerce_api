import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './execption';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs'
import * as morgan from 'morgan'
import * as path from 'path'
import * as rfs from 'rotating-file-stream'
import * as dfns from 'date-fns'

function logFilename() {
  return `${dfns.format(new Date(), 'yyyy-MM-dd')}-access.log`;
}

const logStream = rfs.createStream(logFilename,{
  interval:'1d',
  path: path.join(__dirname,'..', 'log')
})

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
  app.use(morgan((tokens,req,res)=>{
    delete req.body.password
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['user-agent'](req, res),
      tokens['remote-addr'](req, res),
      JSON.stringify(req.cookies),
      JSON.stringify(req.body),
    ].join(' ')
  },{stream:logStream}))

  await app.listen(port, () => {
    let logger = new Logger('START');
    logger.debug(`server is listening on port ${port}`)
  });
}
bootstrap();
