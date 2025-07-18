import { JwtAuthGuard } from "@mk/common/guards/jwt.guard";
import { OrganizationalUnitGuard } from "@mk/common/guards/organizational-unit.guard";
import { RoleGuard } from "@mk/common/guards/role.guard";
import { TenancyGuard } from "@mk/common/guards/tenancy.guard";
import { TEntityCrudController } from "@mk/common/utils/shared-crud.controller";
import { BudgetCalendar } from "@mk/database/entities/budget-calendar.entity";
import { Controller, Inject, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateBudgetCalendarDto } from "../dto/create-budget-calendar.dto";
import { RespondBudgetCalendarDto } from "../dto/respond-budget-calendar.dto";
import { UpdateBudgetCalendarDto } from "../dto/update-budget-calendar.dto";
import { BudgetCalendarService } from "../services/budget.calendar.service";


@ApiTags('Budget Calendar')
@UseGuards(JwtAuthGuard, TenancyGuard, RoleGuard, OrganizationalUnitGuard)
@Controller('budget/calendar')
export class BudgetCalendarController extends TEntityCrudController<BudgetCalendar>({
        createDto: CreateBudgetCalendarDto,
        updateDto: UpdateBudgetCalendarDto,
        responseDto: RespondBudgetCalendarDto,
        entityName: "Budget Calendar"
    }) {
    constructor(@Inject() private readonly budgetCalendarService: BudgetCalendarService) {
        super(budgetCalendarService);
    }
}