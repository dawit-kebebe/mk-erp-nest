import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { RoleGuard } from '@mk/common/guards/role.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { ContextModule } from '@mk/common/modules/context.module';
import { ChartOfAccounts } from '@mk/database/entities/chart-of-accounts.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccountsController } from './chart-of-accounts/controllers/chart-of-accounts.controller';
import { ChartOfAccountsService } from './chart-of-accounts/services/chart-of-accounts.service';
import { DependanciesModule } from '@mk/common/modules/dependancies.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChartOfAccounts
        ]),
        ContextModule,
        DependanciesModule
    ],
    exports: [],
    controllers: [ChartOfAccountsController],
    providers: [JwtAuthGuard, TenancyGuard, RoleGuard, ChartOfAccountsService]
})
export class FinanceModule { }
