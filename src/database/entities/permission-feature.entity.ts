import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Permission } from './permission.entity';
import { Feature } from './feature.entity';
import { PermissionAction } from './permission.action.entity';

@Entity('permission_to_features')
export class PermissionFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Permission, (permission) => permission.permissionFeatures)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @ManyToOne(() => Feature)
  @JoinColumn({ name: 'feature_id' })
  feature: Feature;

  @OneToOne(() => PermissionAction, (action) => action.permissionFeature, {
    cascade: true,
  })
  @JoinColumn({ name: 'action_id' })
  action: PermissionAction;
}
