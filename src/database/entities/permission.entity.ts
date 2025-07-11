import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { AccessLevel } from "./access-level.entity";

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'feature_tag', type: 'varchar', length: 100, unique: true })
  featureTag: string;

  @Column({ type: 'boolean', default: false })
  view: boolean;

  @Column({ type: 'boolean', default: false })
  add: boolean;

  @Column({ type: 'boolean', default: false })
  update: boolean;

  @Column({ type: 'boolean', default: false })
  delete: boolean;

  @Column({ type: 'boolean', default: false })
  approve: boolean;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToOne(() => AccessLevel, (accessLevel) => accessLevel.permission, {
    cascade: true,
    eager: true,
  })
  accessLevel: AccessLevel
}