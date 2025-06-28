import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationalUnitTypeDto } from './create-organizational-unit-type.dto';

export class UpdateOrganizationalUnitTypeDto extends PartialType(CreateOrganizationalUnitTypeDto) {}
