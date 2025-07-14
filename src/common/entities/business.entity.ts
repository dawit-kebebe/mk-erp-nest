import { Column, Entity } from "typeorm";
import { BUSINESS_ENTITY_STATUS } from "../enum/business-entity-status.enum";
import { TenantOrganizationalUnitAware } from "./tenant-org-unit.entity";

export class BusinessEntity extends TenantOrganizationalUnitAware{
    @Column({ type: 'varchar', default: BUSINESS_ENTITY_STATUS.DRAFT })
    status: BUSINESS_ENTITY_STATUS;
}