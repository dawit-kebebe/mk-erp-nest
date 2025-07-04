import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleOptions } from './common/config/config-module-options';
import { TypeOrmService } from './common/utils/shared-typeorm.service';
import { TenantContext } from './common/utils/tenant.context';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmService
		}),
		AuthModule
	],
	controllers: [],
	providers: [TenantContext]
})
export class AppModule { }
