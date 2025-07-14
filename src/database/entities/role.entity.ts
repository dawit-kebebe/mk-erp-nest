import { Tenant } from '@mk/common/entities/tenant.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role extends Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Permission, (perm) => perm.role, {
    cascade: true,
    eager: true, // optional: auto-loads permissions
  })
  permissions: Permission[];

}
