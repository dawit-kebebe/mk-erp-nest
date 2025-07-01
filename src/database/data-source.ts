import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { runSeeders } from "typeorm-extension";
config();

export enum DbmsType {
  MYSQL = "mysql",
  POSTGRES = "postgres",

  AURORA_MYSQL = "aurora-mysql",
}

const {
  DB_DBMS = DbmsType.MYSQL,
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USERNAME = "root",
  DB_PASSWORD = "",
  DB_DATABASE = "erp-nest",
  DB_SYNCHRONIZE = 'false',

  DB_REGION,
  DB_SECRET_ARN,
  DB_RESOURCE_ARN,

} = process.env;

const dbms = DB_DBMS as DbmsType;
const port = Number(DB_PORT) || 3306;

const baseConfig = {
  host: DB_HOST,
  port,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: ["dist/database/entities/*.entity.js"],
  migrations: ["dist/database/migrations/*.js"],
  seeds: ['dist/database/seeders/*.seeder.js'],
  factories: ['dist/database/seeders/*.factory.js'],
  synchronize: DB_SYNCHRONIZE === 'true',
  logging: true,
};

export const dataSourceOptions = (
  dbms === DbmsType.AURORA_MYSQL
    ? {
      type: DbmsType.AURORA_MYSQL,
      ...baseConfig,
      region: DB_REGION!,
      secretArn: DB_SECRET_ARN!,
      resourceArn: DB_RESOURCE_ARN!,
    }
    : {
      type: dbms,
      ...baseConfig,
    }
) satisfies DataSourceOptions;


const dataSource = new DataSource(dataSourceOptions);

export default dataSource;