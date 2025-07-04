import { TGenericEntityCrudService } from "@mk/common/utils/shared-generic-cu.service";
import { OrganizationalUnitType } from "@mk/database/entities/organizational-unit-type.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OrganizationalUnitTypeService extends TGenericEntityCrudService<OrganizationalUnitType> {
    constructor(@InjectRepository(OrganizationalUnitType) private readonly oraganizationalUnitType: Repository<OrganizationalUnitType>) {
        super(oraganizationalUnitType)
    }
}