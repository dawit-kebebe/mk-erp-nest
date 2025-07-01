import { Tenant } from '@mk/common/entities/tenant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganizationalUnit } from './organizational-unit.entity';
import { Role } from './role.entity';
import { Expose } from 'class-transformer';

@Entity('users')
export class User extends Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  fName: string;

  @Column({ type: 'varchar', length: 100 })
  lName: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'uuid', nullable: true })
  roleId?: string;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'roleId' })
  role?: Role;

  @Column({ type: 'uuid', nullable: true })
  organizationalUnitId: string;

  @ManyToOne(() => OrganizationalUnit, { nullable: true })
  @JoinColumn({ name: 'organizationalUnitId' })
  organizationalUnit: OrganizationalUnit;
}
