import { Controller } from '@nestjs/common';
import { OrganizationalUnitService } from '../services/organizational-unit.service';
import { RespondOrganizationalUnitDto } from '../dto/respond-organizational-unit.dto';
import { UpdateOrganizationalUnitDto } from '../dto/update-organizational-unit.dto';
import { CreateOrganizationalUnitDto } from '../dto/create-organizational-unit.dto';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { TEntityCrudController } from '@mk/common/utils/shared-crud.controller';

@Controller('organizational-unit')
export class OrganizationalUnitController extends TEntityCrudController<OrganizationalUnit>({
    createDto: CreateOrganizationalUnitDto,
    updateDto: UpdateOrganizationalUnitDto,
    responseDto: RespondOrganizationalUnitDto,
    entityName: "Organizational Unit"
}) {
    constructor(private readonly organizationalUnitService: OrganizationalUnitService) {
        super(organizationalUnitService)
    }
}