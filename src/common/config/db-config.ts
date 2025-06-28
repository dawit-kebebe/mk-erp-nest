import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";

export enum DbmsType {
  MYSQL = "mysql",
  POSTGRES = "postgres",
  AURORA_MYSQL = "aurora-mysql",
}

// Accept a ConfigService instance to fetch config values
export const dataSourceOptions = (configService: ConfigService) => {
  const dbms = configService.get<DbmsType>('DB_DBMS', DbmsType.MYSQL);
  const port = Number(configService.get<string>('DB_PORT', '3306')) || 3306;

  const baseConfig = {
    host: configService.get<string>('DB_HOST', 'localhost'),
    port,
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_DATABASE', 'erp-nest'),
    entities: ["dist/database/entities/*.entity.js"],
    migrations: ["dist/database/migrations/*.js"],
    synchronize: configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
    logging: true,
  };

  if (dbms === DbmsType.AURORA_MYSQL) {
    return {
      type: DbmsType.AURORA_MYSQL,
      ...baseConfig,
      region: configService.get<string>('DB_REGION'),
      secretArn: configService.get<string>('DB_SECRET_ARN'),
      resourceArn: configService.get<string>('DB_RESOURCE_ARN'),
    } as DataSourceOptions;
  } else {
    return {
      type: dbms,
      ...baseConfig,
    } as DataSourceOptions;
  }
};

// Usage example (e.g. in a NestJS provider):
// const dataSource = new DataSource(dataSourceOptions(configService));
// export default dataSource;