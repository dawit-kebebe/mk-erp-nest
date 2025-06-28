import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionFeature } from './permission-feature.entity';

@Entity('permissions')
export class Permission {
  @ApiProperty({ description: 'Unique identifier for the permission', example: 'b1a2c3d4-e5f6-7890-abcd-1234567890ab' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Unique tag for the permission', example: 'USER_CREATE' })
  @Column({ type: 'varchar', length: 100, unique: true })
  tag: string;

  @ApiPropertyOptional({ description: 'Description of the permission', example: 'Allows creation of users' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiPropertyOptional({ type: () => [PermissionFeature], description: 'Features associated with this permission' })
  @OneToMany(() => PermissionFeature, (pf) => pf.permission, { cascade: true })
  permissionFeatures: PermissionFeature[];
}