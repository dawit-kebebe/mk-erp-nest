import { Exclude } from "class-transformer";
import { Column, JoinColumn, ManyToOne } from "typeorm";
import { Tenant } from "./tenant.entity";
import { OrganizationalUnit } from "@mk/database/entities/organizational-unit.entity";
export class TenantOrganizationalUnitAware extends Tenant {
    @Column({ type: 'uuid', nullable: false })
    organizationalUnitId: string;

    @ManyToOne(() => OrganizationalUnit, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organizationalUnitId' })
    organizationalUnit: OrganizationalUnit;
}