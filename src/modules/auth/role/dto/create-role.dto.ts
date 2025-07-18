import { ACCESS_LEVEL } from '@mk/common/enum/access-level.enum';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDefined, IsEnum, IsOptional, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';

class CreateAccessLevelDto {
  @ApiProperty({ description: 'The name of the access level', enum: ACCESS_LEVEL, example: ACCESS_LEVEL.CHILDREN, required: true })
  @IsDefined()
  @IsEnum(ACCESS_LEVEL)
  accessLevelTag: ACCESS_LEVEL;

  @ApiProperty({
    description: 'The list organizational units of which this role has access to, if any. Only required if the access level is set to MULTI_UNIT.',
    required: false,
    type: [String],
    example: ['a3f1c2d4-5678-1234-9abc-def012345678']
  })
  @ValidateIf((dto) => dto.accessLevelTag === ACCESS_LEVEL.MULTI_UNIT)
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all')
  organizationalUnits?: string[]
}

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

  @ApiProperty({ description: 'Access Level assigned to the role', type: () => CreateAccessLevelDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateAccessLevelDto)
  accessLevel: CreateAccessLevelDto;
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
  @IsArray()
  @ArrayNotEmpty()
  @IsDefined() // <-- This ensures it's present
  @ValidateNested()
  @Type(() => CreatePermissionDto)
  permissions: CreatePermissionDto[];
}