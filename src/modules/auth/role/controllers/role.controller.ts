import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleService } from '../services/role.service';
import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { TEntityCrudController } from '@mk/common/utils/shared-crud.controller';
import { Role } from '@mk/database/entities/role.entity';
import { RespondRoleDto } from '../dto/respond-role.dto';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { RespondFeatureListDto } from '../dto/respond-feature-list.dto';

@ApiTags('Role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenancyGuard)
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
}
