import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";

export enum DbmsType {
	MYSQL = "mysql",
	POSTGRES = "postgres",
	AURORA_MYSQL = "aurora-mysql",
}

// Accept a ConfigService instance to fetch config values
export const dataSourceOptions = (configService: ConfigService) => {
	const dbms = configService.get<DbmsType>('DB_DBMS');
	if (!dbms || !Object.values(DbmsType).includes(dbms)) {
		throw new Error('DB_DBMS must be set to a valid DBMS type (mysql, postgres, aurora-mysql).');
	}

	const portString = configService.get<string>('DB_PORT');
	const port = Number(portString);
	if (!portString || isNaN(port)) {
		throw new Error('DB_PORT must be set to a valid number between [1 - 65].');
	}

	const baseConfig = {
		host: configService.get<string>('DB_HOST'),
		port,
		username: configService.get<string>('DB_USERNAME'),
		password: configService.get<string>('DB_PASSWORD'),
		database: configService.get<string>('DB_DATABASE'),
		entities: ["dist/database/entities/*.entity.js"],
		migrations: ["dist/database/migrations/*.js"],
		synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
		logging: true,
	};

	// Validation for required DB config parameters
	const requiredParams = [
		{ key: 'DB_HOST', value: baseConfig.host },
		{ key: 'DB_USERNAME', value: baseConfig.username },
		{ key: 'DB_PASSWORD', value: baseConfig.password },
		{ key: 'DB_DATABASE', value: baseConfig.database },
	];
	for (const param of requiredParams) {
		if (typeof param.value !== 'string' || !param.value.trim()) {
			throw new Error(`Environment variable ${param.key} is required and was not provided or is empty.`);
		}
	}

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