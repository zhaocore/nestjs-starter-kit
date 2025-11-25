export const getConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    jwtSecret: process.env.JWT_SECRET as string,
    logLevel: process.env.LOG_LEVEL || 'debug',
    database: {
      dbType: (process.env.DB_TYPE as any) || 'mysql',
      host: process.env.DB_HOST as string,
      port: parseInt(process.env.DB_PORT as string, 10) || 3306,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      dbName: process.env.DB_DB as string,
      databasePath: process.env.DB_DATABASE_PATH as string, // For SQLite
    },
    cache: {
      useMemoryCache: process.env.USE_MEMORY_CACHE === 'true',
      host: process.env.REDIS_HOST as string,
      port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
      password: process.env.REDIS_PASSWORD as string,
    },
    mail: {
      from: process.env.MAIL_FROM as string,
      transportOptions: {
        host: process.env.MAIL_HOST as string,
        port: parseInt(process.env.MAIL_PORT as string, 10),
        auth: {
          user: process.env.MAIL_AUTH_USER as string,
          pass: process.env.MAIL_AUTH_PASS as string,
        },
      },
    },
  };
};

export interface AppConfig {
  port: number;
  jwtSecret: string;
  logLevel: string;
  database: DbConfig;
  cache: CacheConfig;
  mail: MailConfig;
}

export interface DbConfig {
  dbType: 'mysql' | 'postgres' | 'better-sqlite3';
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
  databasePath: string; // For SQLite file path
}

export interface CacheConfig {
  useMemoryCache: boolean;
  host: string;
  port: number;
  password: string;
}

export interface MailConfig {
  from: string;
  transportOptions: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
}
