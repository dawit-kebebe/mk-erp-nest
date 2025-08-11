import { RequiredPermissions } from "@mk/common/decorators/RequiredPermission";
import { ACCOUNT_TYPES } from "@mk/common/enum/account-types.enum";
import { FEATURES } from "@mk/common/enum/feature.enum";
import { JwtAuthGuard } from "@mk/common/guards/jwt.guard";
import { RoleGuard } from "@mk/common/guards/role.guard";
import { TenancyGuard } from "@mk/common/guards/tenancy.guard";
import { TEntityCrudController } from "@mk/common/utils/shared-crud.controller";
import { ChartOfAccounts } from "@mk/database/entities/chart-of-accounts.entity";
import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateChartOfAccountsDto } from "../dto/create-chart-of-accounts.dto";
import { RespondAccountTypeListDto } from "../dto/respond-account-type-list.dto";
import { RespondChartOfAccountsDto } from "../dto/respond-chart-of-accounts.dto";
import { UpdateChartOfAccountsDto } from "../dto/update-chart-of-accounts.dto";
import { ChartOfAccountsService } from "../services/chart-of-accounts.service";

@ApiTags('Chart of Accounts')
@Controller('/finance/chart-of-accounts')
@UseGuards(JwtAuthGuard, TenancyGuard, RoleGuard)
@RequiredPermissions(FEATURES.CHART_OF_ACCOUNTS)
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

  @Get('/account-types')
  @ApiOperation({
    summary: `Get all the account type tags.`
  })
  @ApiResponse({
    status: 200,
    description: `List of account type tags`,
    type: RespondAccountTypeListDto,
  })
  getAccountTypes() {
    const accountTypes = new RespondAccountTypeListDto();
    accountTypes.accountTypes = Object.values(ACCOUNT_TYPES);
    return accountTypes;
  }
}