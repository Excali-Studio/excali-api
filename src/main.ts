import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as SessionFileStore from 'session-file-store';
import { LoggingInterceptor } from '@algoan/nestjs-logging-interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'OPTIONS', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(json({ limit: '80mb' }));

  //Sessions are stored in the local filesystem temporarily to make dev easier
  //@TODO move sessions to memory or ex external store
  const FS = SessionFileStore(expressSession);
  app.use(
    expressSession({
      store: new FS({}),
      secret: ':)',
      saveUninitialized: false,
      resave: false,
      cookie: { maxAge: 3600 * 1000 * 3 }, //3 hours
    }),
  );

  app.use(passport.initialize());

  app.use(
    passport.session({
      pauseStream: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ExcaliStudio')
    .setDescription('Documentation of API endpoints')
    .setVersion('0.0.2')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
