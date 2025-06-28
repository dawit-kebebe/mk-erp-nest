import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'feature_tag', type: 'varchar', length: 100, unique: true })
  featureTag: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // @OneToMany(() => PermissionFeature, pf => pf.feature, { cascade: true })
  // permissionFeatures: PermissionFeature[];
}
