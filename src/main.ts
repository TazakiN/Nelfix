import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as hbs from 'hbs';
import * as layouts from 'handlebars-layouts';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Enable CORS and configure it
  app.enableCors({
    origin: 'https://labpro-fe.hmif.dev', // your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  hbs.registerPartials(resolve('./views/partials'));
  hbs.registerPartials(resolve('./views/layouts'));
  hbs.registerHelper('eq', function (a, b) {
    return a === b;
  });
  hbs.registerHelper(layouts(hbs.handlebars));

  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./views'));
  app.setViewEngine('hbs'); //asdksaldj

  app.use(express.urlencoded({ extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const port = app.get(ConfigService).get('PORT');
  await app.listen(port);
}
bootstrap();
