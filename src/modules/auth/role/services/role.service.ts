import { TGenericEntityCrudService } from '@mk/common/utils/shared-generic-cu.service';
import { Role } from '@mk/database/entities/role.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleService extends TGenericEntityCrudService<Role> {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
	) {
		super(roleRepository)
	}

	async create(itemData: CreateRoleDto): Promise<Role> {
		const role = await this.create(itemData);
		await this.cacheManager.set(role.id, role);
		return role;
	}

	async update(id: string, itemData: UpdateRoleDto): Promise<Role> {
		const role = await this.update(id, itemData);
		await this.cacheManager.set(role.id, role);
		return role;
	}
}
