import { RequiredPermissions } from '@mk/common/decorators/RequiredPermission';
import { ACCESS_LEVEL } from '@mk/common/enum/access-level.enum';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { RoleGuard } from '@mk/common/guards/role.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { TEntityCrudController } from '@mk/common/utils/shared-crud.controller';
import { Role } from '@mk/database/entities/role.entity';
import {
	Controller,
	Get,
	UseGuards
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RespondAccessLevelListDto } from '../dto/respond-access-level-list.dto';
import { RespondFeatureListDto } from '../dto/respond-feature-list.dto';
import { RespondRoleDto } from '../dto/respond-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleService } from '../services/role.service';

@ApiTags('Role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenancyGuard, RoleGuard)
@RequiredPermissions(FEATURES.ROLE)
@Controller('role')
export class RoleController extends TEntityCrudController<Role>({
	createDto: CreateRoleDto,
	responseDto: RespondRoleDto,
	updateDto: UpdateRoleDto,
	entityName: "Role"
}) {
	constructor(private readonly roleService: RoleService) {
		super(roleService);
	}

	@Get('/feature-tags')
	@ApiOperation({
		summary: `Get the complete feature tags list.`
	})
	@ApiResponse({
		status: 200,
		description: `List of feature tags`,
		type: RespondFeatureListDto,
	})
	getFeatureTags() {
		const features = new RespondFeatureListDto();
		features.featureTags = Object.values(FEATURES);
		return features;
	}

	@Get('/access-level-tags')
	@ApiOperation({
		summary: `Get all the access level tags.`
	})
	@ApiResponse({
		status: 200,
		description: `List of access level tags`,
		type: RespondAccessLevelListDto,
	})
	getAccessLevelTags() {
		const accessLevels = new RespondAccessLevelListDto();
		accessLevels.accessLevelTags = Object.values(ACCESS_LEVEL);
		return accessLevels;
	}
}
