import { Tenant } from '@mk/common/entities/tenant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { OrganizationalUnitType } from './organizational-unit-type.entity';
import { User } from './user.entity';

@Entity('organizational_units')
export class OrganizationalUnit extends Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => OrganizationalUnit, (org) => org.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentOrgId' })
  parentOrg?: OrganizationalUnit;

  @Column({ type: 'uuid', nullable: true })
  parentOrgId?: string;

  @OneToMany(() => OrganizationalUnit, (org) => org.parentOrg)
  children?: OrganizationalUnit[];

  @ManyToOne(() => OrganizationalUnitType, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'organizationalUnitTypeId' })
  organizationalUnitType: OrganizationalUnitType;

  @Column({ type: 'uuid' })
  organizationalUnitTypeId: string;

  @OneToMany(() => User, (user) => user.organizationalUnit)
  users?: User[];
}
