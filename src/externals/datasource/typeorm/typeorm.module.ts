import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import EnvironmentConfigService  from 'api/config/environment-config/environment-config.service';
import EnvironmentConfigModule from 'api/config/environment-config/environment-config.module';
import { postgresDataSource } from './postgres.data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: postgresDataSource,
    }),
  ],
})
export default class TypeOrmConfigModule {}