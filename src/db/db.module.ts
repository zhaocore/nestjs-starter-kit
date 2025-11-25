import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const {
          database: { host, port, password, user, dbName, dbType, database },
        } = getConfig();

        Logger.debug('Database connection details:', {
          type: dbType,
          host,
          port,
          user,
          dbName,
          database,
        });

        // SQLite configuration
        if (dbType === 'better-sqlite3') {
          return {
            type: dbType,
            database: database || './data/local.db',
            autoLoadEntities: true,
            synchronize: true, // Auto-create tables in local mode
            logging: false,
          };
        }

        // MySQL/PostgreSQL configuration
        return {
          type: dbType,
          host,
          port,
          username: user,
          password,
          database: dbName,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DbModule {}
