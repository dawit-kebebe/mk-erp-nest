import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleOptions } from './common/config/config-module-options';
import { TenantAwareSubscriber } from './common/typeorm/tenant.subscriber';
import { TypeOrmService } from './common/utils/shared-typeorm.service';
import { TenantContext } from './common/utils/tenant.context';
import { AuthModule } from './modules/auth/auth.module';
import { ClsModule } from 'nestjs-cls';

@Module({
	imports: [
		ClsModule.forRoot({
			global: true, // Makes ClsService available globally
			middleware: {
				mount: true, // Mounts ClsMiddleware to automatically set up context for HTTP requests
				// You can also specify specific routes:
				// forRoutes: ['*'] // or ['your/api/*', 'another/route']
			},
		}),
		ConfigModule.forRoot(configModuleOptions),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmService,
			inject: [TenantContext, TenantAwareSubscriber]
		}),
		AuthModule
	],
	controllers: [],
	providers: [TenantContext, TenantAwareSubscriber]
})
export class AppModule { }
