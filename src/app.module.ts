import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleOptions } from './common/config/config-module-options';
import { TypeOrmService } from './common/utils/shared-typeorm.service';
import { TenantContext } from './common/utils/tenant.context';
import { AuthModule } from './modules/auth/auth.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmService
		}),
		CacheModule.register({
			isGlobal: true
		}),
		AuthModule
	],
	controllers: [],
	providers: [TenantContext, {
		provide: APP_INTERCEPTOR,
		useClass: CacheInterceptor,
	}]
})
export class AppModule { }
