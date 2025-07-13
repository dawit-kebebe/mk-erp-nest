import { Exclude } from "class-transformer";
import { Column, Entity } from "typeorm";
import { Audit } from "./audit.entity";

@Entity()
export class OrganizationalUnitAware extends Audit {
    @Exclude()
    @Column({ type: 'uuid', default: process.env.GLOBAL_TENANT || 'default-tenant-uuid' })
    organizationalUnitId: string
}