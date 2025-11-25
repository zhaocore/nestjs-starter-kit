import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BaseModule } from './base/base.module';
import { AsyncStorageMiddleware } from './base/middleware/async-storage/async-storage.middleware';
import { AppCacheModule } from './cache/cache.module';
import { getConfig } from './config/configuration';
import { DbModule } from './db/db.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './modules/user/user.module';
import { TasksModule } from './schedule/tasks.module';
// import { CsurfMiddleware } from '@nest-middlewares/csurf';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { ResponseTimeMiddleware } from '@nest-middlewares/response-time';
import { DetailModule } from './modules/detail-page/detail.module';
import { IndexModule } from './modules/index-page/index.module';

@Module({
  imports: [
    BaseModule,
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
    }),
    DbModule,
    AppCacheModule,
    UserModule,
    ConfigModule,
    LoggerModule,
    ScheduleModule.forRoot(),
    TasksModule,
    DetailModule,
    IndexModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AsyncStorageMiddleware).forRoutes('*');
    // CsurfMiddleware.configure({ cookie: true });
    // consumer.apply(CsurfMiddleware).forRoutes('*');
    HelmetMiddleware.configure({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", "'unsafe-inline'"], // SSR 需要 'unsafe-inline'
          imgSrc: ["'self'", 'data:', 'https:', 'http:'], // 允许图片从各种来源加载
        },
      },
    });
    consumer
      .apply(
        AsyncStorageMiddleware,
        CorsMiddleware,
        // HelmetMiddleware, // SSR 暂时关闭
        ResponseTimeMiddleware,
      )
      .forRoutes('*');
  }
}
