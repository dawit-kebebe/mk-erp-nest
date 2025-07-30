import { TenantContext } from '@mk/common/contexts/tenant.context';
import { ACCESS_LEVEL } from '@mk/common/enum/access-level.enum';
import { TEntityCrudService } from '@mk/common/utils/shared-crud.service';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { Role } from '@mk/database/entities/role.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleService extends TEntityCrudService<Role> {
	private readonly superTenantId: string;
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		@InjectRepository(OrganizationalUnit)
		private readonly organizationalUnitRepository: Repository<OrganizationalUnit>,
		@Inject() private readonly config: ConfigService,
		@Inject() readonly tenantContext: TenantContext,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {
		super(roleRepository, tenantContext)
		this.superTenantId = this.config.get<string>('GLOBAL_TENANT')!;
	}

	async create(itemData: CreateRoleDto): Promise<Role | Role[]> {
		const tenantId = this.tenantContext.tenantId;

		if (!isUUID(tenantId)) {
			throw new ForbiddenException('Tenant ID is missing from context.');
		}

		const roleMapped = plainToInstance(Role, itemData);
		const role = this.roleRepository.create(roleMapped);

		role.permissions.forEach(permission => {
			if (
				(permission.accessLevel.accessLevelTag === ACCESS_LEVEL.MULTI_UNIT)
				&&
				(!permission.accessLevel.organizationalUnits || !Array.isArray(permission.accessLevel.organizationalUnits) || permission.accessLevel.organizationalUnits.length === 0)
			) {
				throw new BadRequestException(`Invalid multi access level configuration for feature '${permission.featureTag}'.`);
			}
		});

		const insertedRole = await this.roleRepository.save(role);
		if (insertedRole) {
			await this.cacheManager.set(`role:${insertedRole.id}`, insertedRole);
		}

		return insertedRole;
	}

	async update(id: string, itemData: UpdateRoleDto): Promise<Role> {
		const tenantId = this.tenantContext.tenantId;

		if (!isUUID(tenantId)) {
			throw new ForbiddenException('Tenant ID is missing from context.');
		}

		const roleMapped = plainToInstance(Role, itemData); // DeepPartial<Role>
		if (roleMapped.permissions) {
			roleMapped.permissions.forEach(permission => {
				if (
					(permission.accessLevel.accessLevelTag === ACCESS_LEVEL.MULTI_UNIT)
					&&
					(!permission.accessLevel.organizationalUnits || !Array.isArray(permission.accessLevel.organizationalUnits) || permission.accessLevel.organizationalUnits.length === 0)
				) {
					throw new BadRequestException(`Invalid multi access level configuration for feature '${permission.featureTag}'.`);
				}
			});
		}

		const whereClause = tenantId === this.superTenantId ? { id } : { id, tenantId } as any;
		const existing = await this.roleRepository.findOne({ where: whereClause, relations: ['permissions', 'permissions.accessLevel', 'permissions.accessLevel.organizationalUnits'] });
		if (!existing) {
			throw new NotFoundException('Role not found for this tenant.');
		}

		// await this.roleRepository.update(id, roleMapped);
		// Map existing permissions to existing entities to avoid duplicate inserts
		if (roleMapped.permissions) {
			roleMapped.permissions = roleMapped.permissions.map(p => {
				const existingPerm = existing.permissions.find(ep => ep.featureTag === p.featureTag);
				if (existingPerm) {
					p.id = existingPerm.id;
					if (p.accessLevel && existingPerm.accessLevel) {
						p.accessLevel.id = existingPerm.accessLevel.id;
					}
				}
				return p;
			});
		}
		
		const merged = this.roleRepository.merge(existing, roleMapped, { tenantId });
		const insertedRole = await this.roleRepository.save(merged);
		if (insertedRole) {
			await this.cacheManager.set(`role:${insertedRole.id}`, insertedRole);
		}

		return insertedRole;
	}
}
