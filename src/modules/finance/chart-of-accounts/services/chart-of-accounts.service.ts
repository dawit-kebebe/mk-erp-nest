import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TGenericEntityCrudService } from '@mk/common/utils/shared-generic-cu.service';
import { ChartOfAccounts } from '@mk/database/entities/chart-of-accounts.entity';

@Injectable()
export class ChartOfAccountsService extends TGenericEntityCrudService<ChartOfAccounts> {
  constructor(
    @InjectRepository(ChartOfAccounts)
    private readonly chartOfAccountsRepository: Repository<ChartOfAccounts>,
  ) {
    super(chartOfAccountsRepository);
  }
}