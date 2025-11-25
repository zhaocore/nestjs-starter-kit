import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheConfig } from 'src/config/configuration';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  private readonly logger = new Logger(CacheConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const cacheConfig = this.configService.get<CacheConfig>(
      'cache',
    ) as CacheConfig;

    // Use in-memory cache if configured or Redis not available
    if (cacheConfig.useMemoryCache || !cacheConfig.host) {
      this.logger.log('Using in-memory cache');
      return {
        ttl: 60 * 60, // 1h
        max: 100, // Maximum number of items in cache
      };
    }

    // Use Redis cache
    this.logger.log(
      `Using Redis cache at ${cacheConfig.host}:${cacheConfig.port}`,
    );
    const { host, port, password } = cacheConfig;

    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: async () => {
        return await redisStore({
          // Store-specific configuration:
          socket: {
            host,
            port,
          },
          password: password ?? null,
        });
      },
      ttl: 60 * 60, // 1h
    };
  }
}
