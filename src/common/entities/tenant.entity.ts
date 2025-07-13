import { Column, Entity } from "typeorm";
import { Audit } from "./audit.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Tenant extends Audit {
    @Exclude()
    @Column({ type: 'uuid', default: process.env.GLOBAL_TENANT || 'default-tenant-uuid' })
    tenantId: string
}