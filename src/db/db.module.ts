import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const {
          database: { host, port, password, user, dbName, dbType },
        } = getConfig();
        Logger.debug('Database connection details:', host, port, user, dbName);
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
