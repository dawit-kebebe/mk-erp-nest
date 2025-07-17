import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { RoleGuard } from '@mk/common/guards/role.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { ContextModule } from '@mk/common/modules/context.module';
import { DependanciesModule } from '@mk/common/modules/dependancies.module';
import { BudgetCalendar } from '@mk/database/entities/budget-calendar.entity';
import { BudgetPlan, BudgetPlanItem } from '@mk/database/entities/budget-plan.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetCalendarController } from './calendar/controllers/budget-calendar.controller';
import { BudgetCalendarService } from './calendar/services/budget.calendar.service';
import { BudgetPlanController } from './plan/controllers/budget-plan.controller';
import { BudgetPlanService } from './plan/services/budget-plan.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BudgetCalendar, BudgetPlan, BudgetPlanItem
        ]),
        ContextModule,
        DependanciesModule
    ],
    exports: [],
    controllers: [BudgetPlanController, BudgetCalendarController],
    providers: [JwtAuthGuard, TenancyGuard, RoleGuard, BudgetPlanService, BudgetCalendarService]
})
export class BudgetModule { }
