import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import 'module-alias/register'; // 解决路径别名问题
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getCwd, initialSSRDevProxy, loadConfig } from 'ssr-common-utils';
import { AppLoggerService } from './logger/services/app-logger/app-logger.service';

function setupSwagger(app: INestApplication<any>) {
  // API docs
  const config = new DocumentBuilder()
    .setTitle('Node API')
    .setDescription(
      `<a
         target="_blank"
         href="https://github.com/zhao-core/nestjs-starter-kit"
       >https://github.com/zhao-core/nestjs-starter-kit</a>`,
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // SSR 相关初始化
  await initialSSRDevProxy(app);
  app.useStaticAssets(join(getCwd(), './build'));
  app.useStaticAssets(join(getCwd(), './public'));
  app.useStaticAssets(join(getCwd(), './build/client'));
  app.useStaticAssets(join(getCwd(), './public'));

  /*
    Required to be executed before async storage middleware
    and not loose context on POST requests
   */
  app.use(bodyParser.json());

  app.use(cookieParser()); // 使用 Cookie Parser 中间件

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  setupSwagger(app);

  const { serverPort } = loadConfig();
  await app.listen(serverPort, '0.0.0.0');

  logger.log(`App started on http://localhost:${serverPort}`);
  logger.log(
    `Swagger Document started on http://localhost:${serverPort}/swagger`,
  );
}

bootstrap();
