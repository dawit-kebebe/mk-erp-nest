import { TEntityCrudService } from "@mk/common/utils/shared-crud.service";
import { OrganizationalUnitType } from "@mk/database/entities/organizational-unit-type.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OrganizationalUnitTypeService extends TEntityCrudService<OrganizationalUnitType> {
    constructor(@InjectRepository(OrganizationalUnitType) private readonly oraganizationalUnitType: Repository<OrganizationalUnitType>) {
        super(oraganizationalUnitType)
    }
}