import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PermissionFeature } from './permission-feature.entity';

@Entity('permission_actions')
export class PermissionAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  view: boolean;

  @Column({ type: 'boolean', default: false })
  add: boolean;

  @Column({ type: 'boolean', default: false })
  delete: boolean;

  // @Column({ type: 'boolean', default: false })
  // approval1: boolean;

  // @Column({ type: 'boolean', default: false })
  // approval2: boolean;

  // @Column({ type: 'boolean', default: false })
  // approval3: boolean;

  // @Column({ type: 'boolean', default: false })
  // approval4: boolean;

  // @Column({ type: 'boolean', default: false })
  // approval5: boolean;

  @ManyToOne(() => PermissionFeature, (pf) => pf.action, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_feature_id' })
  permissionFeature: PermissionFeature;
}
