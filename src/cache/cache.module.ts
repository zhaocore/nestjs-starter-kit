import { Inject, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheConfigService } from './cache-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { LoggerModule } from '../logger/logger.module';
import { CacheConfig } from '../config/configuration';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfigService,
    }),
  ],
  providers: [CacheConfigService],
  exports: [CacheModule],
})
export class AppCacheModule implements OnModuleDestroy {
  private readonly logger = new Logger(AppCacheModule.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  onModuleDestroy(): any {
    const cacheConfig = this.configService.get<CacheConfig>('cache');
    // Only disconnect if using Redis
    if (cacheConfig && !cacheConfig.useMemoryCache && cacheConfig.host) {
      this.logger.log('Disconnecting from Redis cache');
      try {
        (this.cacheManager.store as any).getClient()?.quit(true);
      } catch (error) {
        this.logger.warn('Failed to disconnect from cache:', error);
      }
    } else {
      this.logger.log('Closing in-memory cache');
    }
  }
}
