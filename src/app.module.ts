import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import EnvironmentConfigModule from 'api/config/environment-config/environment-config.module';
import RoutesModule from 'api/routes/routes.module';
import RepositoriesModule from 'externals/datasource/typeorm/repositories/repositories.module';
import ProvidersModule from 'externals/providers/providers.module';

@Module({
  imports: [    
    EnvironmentConfigModule,
    HttpModule,
    TypeOrmModule,
    RoutesModule.resgister(),
    RepositoriesModule.resgister(),
    ProvidersModule.register()],
})
export class AppModule {}
