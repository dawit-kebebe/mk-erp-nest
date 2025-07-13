import { OrganizationalUnit } from "../../database/entities/organizational-unit.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Tenant } from "./tenant.entity";

// @Entity()
export class TenantOrganizationalUnitAware extends Tenant {
    @Column({ type: 'uuid', nullable: false })
    organizationalUnitId: string;

    @ManyToOne(() => OrganizationalUnit, { nullable: false, eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organizationalUnitId' })
    organizationalUnit: OrganizationalUnit;
}