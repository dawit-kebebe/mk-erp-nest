import { config } from "dotenv";
import { Column, Entity } from "typeorm";
import { Audit } from "./audit.entity";
import { Exclude } from "class-transformer";
config();

@Entity()
export class Tenant extends Audit {
    @Exclude()
    @Column({ type: 'uuid', default: process.env.ROOT_TENANT})
    tenantId: string
}
