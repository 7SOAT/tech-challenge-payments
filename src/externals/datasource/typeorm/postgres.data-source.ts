import EnvironmentConfigService  from "api/config/environment-config/environment-config.service";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const postgresDataSource = (config: EnvironmentConfigService): TypeOrmModuleOptions =>
  ({
    type: "postgres",
    host: config.getDatabaseHost(),
    port: config.getDatabasePort() || 5432,
    username: config.getDatabaseUser(),
    password: config.getDatabasePassword(),
    database: config.getDatabaseName(),
    synchronize: true,
    entities: [__dirname + "..\\models\\*.model.ts"],
    ssl: false,
    autoLoadEntities: true
  } as TypeOrmModuleOptions);
