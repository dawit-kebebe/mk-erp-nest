import { TEntityCrudService } from '@mk/common/utils/shared-crud.service';
import { GraphCycleDetectorService } from '@mk/common/utils/shared-graph-cycle-detector.service';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateOrganizationalUnitDto } from '../dto/update-organizational-unit.dto';
import { CreateOrganizationalUnitDto } from '../dto/create-organizational-unit.dto';
import { ConfigService } from '@nestjs/config';
import { TenantContext } from '@mk/common/utils/tenant.context';
import { TenantBaseRepository } from '@mk/common/typeorm/tenant-aware.repository';

@Injectable()
export class OrganizationalUnitService extends TEntityCrudService<OrganizationalUnit> {
    constructor(
        @InjectRepository(OrganizationalUnit) private readonly organizationalUnit: TenantBaseRepository<OrganizationalUnit>,
        @Inject() private readonly configService: ConfigService,
        @Inject() private readonly tenantContext: TenantContext,
        @Inject() private readonly graphCycleDetectorService: GraphCycleDetectorService
    ) {
        super(organizationalUnit)
    }

    async create(itemData: CreateOrganizationalUnitDto): Promise<OrganizationalUnit | OrganizationalUnit[]> {
        const superTenantId = this.configService.get<string>("ROOT_TENANT");

        if (!itemData.parentOrgId || typeof itemData.parentOrgId !== 'string') {
            if (this.tenantContext.tenantId !== superTenantId) 
                throw new ForbiddenException(`Cannot create a root level organizational unit.`);

            const item = this.organizationalUnit.create(itemData);
            console.log(item.id)
            return this.organizationalUnit.save(item);
        }

        return Promise.reject(new Error('Method not implemented.'));

        // const parentOrg = await this.organizationalUnit.findOne({
        //     where: {
        //         id: itemData.parentOrgId
        //     }
        // });

        // let item: OrganizationalUnit;

        // if (parentOrg && parentOrg.id === superTenantId) {
        //     item = this.organizationalUnit.create({
        //         ...itemData,
        //         tenantId: parentOrg.tenantId
        //     });
        // } else {
        //     item = this.organizationalUnit.create({
        //         ...itemData
        //     });
        // }

        // return this.organizationalUnit.save(item);

    }

    update(id: string, itemData: UpdateOrganizationalUnitDto): Promise<OrganizationalUnit> {
        // if (
        //     this.graphCycleDetectorService.hasCycle<UpdateOrganizationalUnitDto>(

        //     )
        // )
        return Promise.reject(new Error('Method not implemented.'));
    }
}