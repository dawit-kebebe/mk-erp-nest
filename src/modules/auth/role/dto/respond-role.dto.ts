import { ACCESS_LEVEL } from '@mk/common/enum/access-level.enum';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

class RespondAccessLevelDto {
  @ApiProperty({ description: 'The name of the access level', enum: ACCESS_LEVEL, example: ACCESS_LEVEL.CHILDREN, required: true })
  @Expose()
  @IsEnum(ACCESS_LEVEL)
  accessLevelTag: ACCESS_LEVEL;

  @ApiProperty({
    description: 'The list organizational units of which this role has access to, if any. Only presented if the access level is set to MULTI_UNIT.',
    required: false,
    type: [String],
    example: ['a3f1c2d4-5678-1234-9abc-def012345678']
  })
  @Expose()
  @ValidateIf((dto) => dto.accessLevelTag === ACCESS_LEVEL.MULTI_UNIT)
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID()
  organizationalUnits?: string[]
}

class RespondPermissionDto {
  @ApiProperty({ description: 'The name of the feature', enum: FEATURES, example: FEATURES.USER })
  @IsEnum(FEATURES)
  @Expose()
  featureTag: FEATURES;

  @ApiProperty({ description: 'Permission to view', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  @Expose()
  view?: boolean = false;

  @ApiProperty({ description: 'Permission to add', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  @Expose()
  add?: boolean = false;

  @ApiProperty({ description: 'Permission to update', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  @Expose()
  update?: boolean = false;

  @ApiProperty({ description: 'Permission to delete', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  @Expose()
  delete?: boolean = false;

  @ApiProperty({ description: 'Permission to approve', default: false, example: true })
  @IsBoolean()
  @IsOptional()
  @Expose()
  approve?: boolean = false;

  @ApiProperty({ description: 'Access Level assigned to the role', type: () => [RespondAccessLevelDto] })
  @Expose()
  @Type(() => RespondAccessLevelDto)
  accessLevel: RespondAccessLevelDto;
}

export class RespondRoleDto {
  @ApiProperty({ description: 'Role ID', example: 'abcdef01-2345-6789-abcd-ef0123456789', type: String, format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name of the role', example: 'Admin' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ description: 'Detailed description of the role', required: false, example: 'Administrator role with full access' })
  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @ApiProperty({ description: 'Permissions assigned to the role', type: () => [RespondPermissionDto] })
  @Expose()
  @Type(() => RespondPermissionDto)
  permissions: RespondPermissionDto[];
}