import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleOptions } from './common/config/config-module-options';
import { TypeOrmService } from './common/utils/shared-typeorm.service';
import { AuthModule } from './modules/auth/auth.module';
import { BudgetModule } from './modules/budget/budget.module';
import { FinanceModule } from './modules/finance/finance.module';
import { WorkflowModule } from './modules/workflow/workflow.module';

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmService
		}),
		CacheModule.register({
			isGlobal: true
		}),
		AuthModule,
		WorkflowModule,
		BudgetModule,
		FinanceModule
	],
	controllers: [],
	providers: [
	// 	{
	// 	provide: APP_INTERCEPTOR,
	// 	useClass: CacheInterceptor,
	// },
	// {
	// 	provide: APP_INTERCEPTOR,
	// 	useClass: InvalidateCacheInterceptor,
	// }
]
})
export class AppModule { }
