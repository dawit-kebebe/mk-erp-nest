import { Exclude } from "class-transformer";
import { Column } from "typeorm";
import { Audit } from "./audit.entity";
export class OrganizationalUnitAware extends Audit {
    @Exclude()
    @Column({ type: 'uuid', default: process.env.GLOBAL_TENANT || 'default-tenant-uuid' })
    organizationalUnitId: string
}