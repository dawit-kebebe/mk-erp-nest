import { Controller, UseGuards } from '@nestjs/common';
import { OrganizationalUnitService } from '../services/organizational-unit.service';
import { RespondOrganizationalUnitDto } from '../dto/respond-organizational-unit.dto';
import { UpdateOrganizationalUnitDto } from '../dto/update-organizational-unit.dto';
import { CreateOrganizationalUnitDto } from '../dto/create-organizational-unit.dto';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { TEntityCrudController } from '@mk/common/utils/shared-crud.controller';
import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenancyGuard)
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