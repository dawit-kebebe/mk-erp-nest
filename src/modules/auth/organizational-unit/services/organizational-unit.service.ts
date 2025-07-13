import { TEntityCrudService } from '@mk/common/utils/shared-crud.service';
import { TenantContext } from '@mk/common/contexts/tenant.context';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { CreateOrganizationalUnitDto } from '../dto/create-organizational-unit.dto';
import { UpdateOrganizationalUnitDto } from '../dto/update-organizational-unit.dto';

@Injectable()
export class OrganizationalUnitService extends TEntityCrudService<OrganizationalUnit> {
    private readonly superTenantId: string;

    constructor(
        @InjectRepository(OrganizationalUnit)
        private readonly repo: Repository<OrganizationalUnit>,
        @Inject() private readonly config: ConfigService,
        @Inject() readonly tenantContext: TenantContext,
    ) {
        super(repo, tenantContext);
        this.superTenantId = this.config.get<string>('GLOBAL_TENANT')!;
    }

    // Create organizational unit without tree logic
    async create(dto: CreateOrganizationalUnitDto): Promise<OrganizationalUnit> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        return await this.repo.manager.transaction(async (entityManager) => {
            const entity = this.repo.create({ ...dto });

            // Parent constraint
            if (dto.parentOrgId) {
                if (!isUUID(dto.parentOrgId)) {
                    throw new BadRequestException('Invalid parent organizational unit ID.');
                }

                const parent = await entityManager.findOne(OrganizationalUnit, { where: { id: dto.parentOrgId } as any });
                if (!parent || (parent.tenantId !== tenantId && tenantId !== this.superTenantId)) {
                    throw new ForbiddenException('Cannot assign parent outside of tenant scope.');
                }

                entity.tenantId = parent.tenantId;
            } else if (tenantId !== this.superTenantId) {
                throw new ForbiddenException('Cannot create root organizational unit.');
            } else {
                const newEntity = await entityManager.save(OrganizationalUnit, entity);
                entity.tenantId = newEntity.id;
            }

            return await entityManager.save(OrganizationalUnit, entity);
        });
    }

    // Update organizational unit without tree logic
    async update(id: string, dto: UpdateOrganizationalUnitDto): Promise<OrganizationalUnit> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid organizational unit ID.');
        }

        // Load existing within tenant scope
        const whereClause = tenantId === this.superTenantId ? { id } : { id, tenantId } as any;
        const existing = await this.repo.findOne({ where: whereClause });
        if (!existing) {
            throw new NotFoundException('Organizational unit not found for this tenant.');
        }

        // Parent constraint
        if (dto.parentOrgId) {
            if (!isUUID(dto.parentOrgId)) {
                throw new BadRequestException('Invalid parent organizational unit ID.');
            }
            const parent = await this.repo.findOne({ where: { id: dto.parentOrgId } as any });
            if (!parent) {
                throw new BadRequestException('Parent organizational unit does not exist.');
            }
            if (parent.tenantId !== tenantId && tenantId !== this.superTenantId) {
                throw new ForbiddenException('Cannot assign parent outside of tenant scope.');
            }
        }

        const merged = this.repo.merge(existing, dto, { tenantId });
        return this.repo.save(merged);
    }
}
