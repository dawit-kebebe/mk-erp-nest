import { RequiredPermissions } from "@mk/common/decorators/RequiredPermission";
import { FEATURES } from "@mk/common/enum/feature.enum";
import { JwtAuthGuard } from "@mk/common/guards/jwt.guard";
import { TEntityCrudController } from "@mk/common/utils/shared-crud.controller";
import { OrganizationalUnitType } from "@mk/database/entities/organizational-unit-type.entity";
import { Controller, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateOrganizationalUnitTypeDto } from "../dto/create-organizational-unit-type.dto";
import { RespondOrganizationalUnitTypeDto } from "../dto/respond-organizational-unit-type.dto";
import { UpdateOrganizationalUnitTypeDto } from "../dto/update-organizational-unit-type.dto";
import { OrganizationalUnitTypeService } from "../services/organizational-unit-type.service";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequiredPermissions(FEATURES.ORGANIZATIONAL_UNIT)
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