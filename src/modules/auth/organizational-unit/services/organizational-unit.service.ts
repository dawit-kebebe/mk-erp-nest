import { TEntityCrudService } from '@mk/common/utils/shared-crud.service';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateOrganizationalUnitDto } from '../dto/create-organizational-unit.dto';
import { GraphCycleDetectorService } from '@mk/common/utils/shared-graph-cycle-detector.service';
import { UpdateOrganizationalUnitDto } from '../dto/update-organizational-unit.dto';

@Injectable()
export class OrganizationalUnitService extends TEntityCrudService<OrganizationalUnit>{
    constructor(
        @InjectRepository(OrganizationalUnit) private readonly organizationalUnit: Repository<OrganizationalUnit>,
        @Inject() private readonly graphCycleDetectorService: GraphCycleDetectorService
    ){
        super(organizationalUnit)
    }

    update(id: string, itemData: UpdateOrganizationalUnitDto): Promise<UpdateResult> {
        // if (
        //     this.graphCycleDetectorService.hasCycle<UpdateOrganizationalUnitDto>(

        //     )
        // )
        return Promise.reject(new Error('Method not implemented.'));
    }
}