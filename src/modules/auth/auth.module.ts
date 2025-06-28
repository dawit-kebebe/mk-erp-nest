import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { Permission } from '@mk/database/entities/permission.entity';
import { Role } from '@mk/database/entities/role.entity';
import { User } from '@mk/database/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication/controllers/authentication.controller';
import { AuthenticationService } from './authentication/services/authentication.service';
import { OrganizationalUnitController } from './organizational-unit/controllers/organizational-unit.controller';
import { OrganizationalUnitService } from './organizational-unit/services/organizational-unit.service';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';
import { Feature } from '@mk/database/entities/feature.entity';
import { OrganizationalUnitType } from '@mk/database/entities/organizational-unit-type.entity';
import { PermissionFeature } from '@mk/database/entities/permission-feature.entity';
import { PermissionAction } from '@mk/database/entities/permission.action.entity';
import { OrganizationalUnitTypeController } from './organizational-unit/controllers/organizational-unit-type.controller';
import { OrganizationalUnitTypeService } from './organizational-unit/services/organizational-unit-type.service';
import { GraphCycleDetectorService } from '@mk/common/utils/shared-graph-cycle-detector.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, OrganizationalUnit, Role, Permission, Feature, OrganizationalUnitType, PermissionFeature, PermissionAction
    ])
  ],
  controllers: [UserController, AuthenticationController, OrganizationalUnitController, OrganizationalUnitTypeController],
  providers: [UserService, AuthenticationService, OrganizationalUnitService, OrganizationalUnitTypeService, GraphCycleDetectorService]
})
export class AuthModule { }
