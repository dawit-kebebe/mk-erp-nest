import { TEntityCrudService } from "@mk/common/utils/shared-crud.service";
import { TenantContext } from "@mk/common/utils/tenant.context";
import { OrganizationalUnit } from "@mk/database/entities/organizational-unit.entity";
import { User } from "@mk/database/entities/user.entity";
import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

@Injectable()
export class UserService extends TEntityCrudService<User> {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(OrganizationalUnit) private readonly organizationalUnit: Repository<OrganizationalUnit>,
		@Inject() private readonly configService: ConfigService,
		@Inject() readonly tenantContext: TenantContext,
	) {
		super(userRepository);
	}

	private async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return bcrypt.hash(password, salt);
	}

	private async getOrgUnit(orgUnitId: string, tenantId: string, isSuperTenant: boolean): Promise<OrganizationalUnit | null> {
		const where: any = { id: orgUnitId };
		if (!isSuperTenant) where.tenantId = tenantId;
		return this.organizationalUnit.findOne({ where });
	}

	async create(itemData: CreateUserDto): Promise<User> {
		const superTenantId = this.configService.get<string>("GLOBAL_TENANT");
		const tenantId = this.tenantContext.tenantId;

		if (!isUUID(tenantId)) throw new ForbiddenException('Tenant ID is missing from context.');

		const isSuperTenant = tenantId === superTenantId;
		const orgUnit = await this.getOrgUnit(itemData.organizationalUnitId, tenantId, isSuperTenant);

		if (!orgUnit) throw new ForbiddenException(`Organizational unit does not exist.`);

		const hashedPassword = await this.hashPassword(itemData.password);

		const user = this.userRepository.create({
			...itemData,
			password: hashedPassword,
			tenantId: orgUnit.tenantId,
		});

		return this.userRepository.save(user);
	}

	async update(id: string, itemData: UpdateUserDto): Promise<User> {
		const superTenantId = this.configService.get<string>("GLOBAL_TENANT");
		const tenantId = this.tenantContext.tenantId;

		if (!isUUID(tenantId)) throw new ForbiddenException('Tenant ID is missing from context.');

		const isSuperTenant = tenantId === superTenantId;
		const where: any = { id };
		if (!isSuperTenant) where.tenantId = tenantId;

		const user = await this.userRepository.findOne({ where });
		if (!user) throw new NotFoundException("User not found.");

		Object.assign(user, itemData);

		if (itemData.organizationalUnitId) {
			const orgUnit = await this.getOrgUnit(itemData.organizationalUnitId, tenantId, isSuperTenant);
			if (!orgUnit) throw new ForbiddenException(`Organizational unit does not exist.`);
			user.tenantId = orgUnit.tenantId;
		}

		if (itemData.password) {
			user.password = await this.hashPassword(itemData.password);
		}
		
		return this.userRepository.save(user);
	}
}