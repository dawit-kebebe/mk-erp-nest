import { TEntityCrudController } from "@mk/common/utils/shared-crud.controller";
import { ChartOfAccounts } from "@mk/database/entities/chart-of-accounts.entity";
import { Controller, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateChartOfAccountsDto } from "../dto/create-chart-of-accounts.dto";
import { RespondChartOfAccountsDto } from "../dto/respond-chart-of-accounts.dto";
import { UpdateChartOfAccountsDto } from "../dto/update-chart-of-accounts.dto";
import { ChartOfAccountsService } from "../services/chart-of-accounts.service";

@ApiTags('Chart of Accounts')
@Controller('chart-of-accounts')
export class ChartOfAccountsController extends TEntityCrudController<ChartOfAccounts>({
  createDto: CreateChartOfAccountsDto,
  updateDto: UpdateChartOfAccountsDto,
  responseDto: RespondChartOfAccountsDto,
  entityName: "Chart of Accounts"
}) {
  constructor(
    @Inject() private readonly chartOfAccountsService: ChartOfAccountsService
  ) {
    super(chartOfAccountsService);
  }
}