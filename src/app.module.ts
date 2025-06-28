import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './common/config/config-module-options';
import { TypeOrmService } from './common/utils/shared-typeorm.service';

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmService }),
		AuthModule
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
