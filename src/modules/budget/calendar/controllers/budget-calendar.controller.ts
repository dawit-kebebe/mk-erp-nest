import { TEntityCrudController } from "@mk/common/utils/shared-crud.controller";
import { Controller, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateBudgetCalendarDto } from "../dto/create-budget-calendar.dto";
import { UpdateBudgetCalendarDto } from "../dto/update-budget-calendar.dto";
import { RespondBudgetCalendarDto } from "../dto/respond-budget-calendar.dto";
import { BudgetCalendar } from "@mk/database/entities/budget-calendar.entity";
import { BudgetCalendarService } from "../services/budget.calendar.service";


@ApiTags('Budget Calendar')
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