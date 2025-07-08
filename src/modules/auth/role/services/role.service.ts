import { TGenericEntityCrudService } from '@mk/common/utils/shared-generic-cu.service';
import { Role } from '@mk/database/entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService extends TGenericEntityCrudService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository)
  }
}
