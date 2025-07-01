import { TEntityCrudController } from "@mk/common/utils/shared-crud.controller";
import { OrganizationalUnitType } from "@mk/database/entities/organizational-unit-type.entity";
import { Controller, UseGuards } from "@nestjs/common";
import { CreateOrganizationalUnitTypeDto } from "../dto/create-organizational-unit-type.dto";
import { RespondOrganizationalUnitTypeDto } from "../dto/respond-organizational-unit-type.dto";
import { UpdateOrganizationalUnitTypeDto } from "../dto/update-organizational-unit-type.dto";
import { OrganizationalUnitTypeService } from "../services/organizational-unit-type.service";
import { JwtAuthGuard } from "@mk/common/guards/jwt.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizational-unit-type')
export class OrganizationalUnitTypeController extends TEntityCrudController<OrganizationalUnitType>({
    createDto: CreateOrganizationalUnitTypeDto,
    updateDto: UpdateOrganizationalUnitTypeDto,
    responseDto: RespondOrganizationalUnitTypeDto,
    entityName: "Organizational Unit Type"
}) {
    constructor(private readonly organizationalUnitTypeService: OrganizationalUnitTypeService) {
        super(organizationalUnitTypeService)
    }
}