import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { TEntityCrudController } from '@mk/common/utils/shared-crud.controller';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrganizationalUnitDto } from '../dto/create-organizational-unit.dto';
import { RespondOrganizationalUnitDto } from '../dto/respond-organizational-unit.dto';
import { UpdateOrganizationalUnitDto } from '../dto/update-organizational-unit.dto';
import { OrganizationalUnitService } from '../services/organizational-unit.service';

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