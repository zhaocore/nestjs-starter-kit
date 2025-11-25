import { readFileSync } from 'fs';
import { join } from 'path';
import { getConfig } from './configuration';

describe('config helper', () => {
  it('should be defined', () => {
    expect(getConfig).toBeDefined();
  });

  it('should return configs', () => {
    const env = readFileSync(join(process.cwd(), '.env.example'), 'utf8')
      .split('\n')
      .reduce((vars: any, i) => {
        const [variable, value] = i.split('=');
        vars[variable] = value;
        return vars;
      }, {});

    process.env = Object.assign(process.env, env);

    expect(getConfig()).toStrictEqual({
      cache: {
        host: 'localhost',
        password: 'redis_secret',
        port: 6379,
        useMemoryCache: false,
      },
      database: {
        databasePath: undefined,
        dbName: 'api',
        dbType: 'mysql',
        host: 'localhost',
        password: 'secret',
        port: 3306,
        user: 'myroot',
      },
      jwtSecret: 'secret',
      logLevel: 'debug',
      port: 9797,
      mail: {
        from: 'no-reply@nestjs-starter-kit.smtp.com',
        transportOptions: {
          auth: {
            pass: 'any-password',
            user: 'any-user',
          },
          host: '127.0.0.1',
          port: 1025,
        },
      },
    });
  });
});
