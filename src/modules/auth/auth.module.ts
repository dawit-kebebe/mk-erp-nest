import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { TenantContext } from '@mk/common/utils/tenant.context';
import { OrganizationalUnitType } from '@mk/database/entities/organizational-unit-type.entity';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';

import { Role } from '@mk/database/entities/role.entity';
import { User } from '@mk/database/entities/user.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication/controllers/authentication.controller';
import { AuthenticationService } from './authentication/services/authentication.service';
import { OrganizationalUnitTypeController } from './organizational-unit/controllers/organizational-unit-type.controller';
import { OrganizationalUnitController } from './organizational-unit/controllers/organizational-unit.controller';
import { OrganizationalUnitTypeService } from './organizational-unit/services/organizational-unit-type.service';
import { OrganizationalUnitService } from './organizational-unit/services/organizational-unit.service';
import { RoleController } from './role/controllers/role.controller';
import { RoleService } from './role/services/role.service';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    TypeOrmModule.forFeature([
      User, OrganizationalUnit, Role, OrganizationalUnitType
    ])
  ],
  exports: [JwtModule, PassportModule],
  controllers: [UserController, AuthenticationController, OrganizationalUnitController, OrganizationalUnitTypeController, RoleController],
  providers: [JwtAuthGuard, TenancyGuard, UserService, AuthenticationService, OrganizationalUnitService, OrganizationalUnitTypeService, RoleService, TenantContext]
})
export class AuthModule { }
