import { FEATURES } from '@mk/common/enum/feature.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

class CreatePermissionDto {
  @ApiProperty({ description: 'The name of the feature', enum: FEATURES, example: FEATURES.USER })
  @IsEnum(FEATURES)
  featureTag: FEATURES;

  @ApiProperty({ description: 'Permission to view', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  view?: boolean = false;

  @ApiProperty({ description: 'Permission to add', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  add?: boolean = false;

  @ApiProperty({ description: 'Permission to update', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  update?: boolean = false;

  @ApiProperty({ description: 'Permission to delete', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  delete?: boolean = false;

  @ApiProperty({ description: 'Permission to approve', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  approve?: boolean = false;
}

export class CreateRoleDto {
  @ApiProperty({ description: 'Name of the role', example: 'Admin' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Detailed description of the role', required: false, example: 'Administrator role with full access' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Permissions assigned to the role', type: () => [CreatePermissionDto] })
  permissions: CreatePermissionDto[];
}