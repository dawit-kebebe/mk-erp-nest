import { setSeederFactory } from 'typeorm-extension';
import { Role } from '../entities/role.entity';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { Permission } from '../entities/permission.entity';
import { ACCESS_LEVEL } from '@mk/common/enum/access-level.enum';

export const RoleFactory = setSeederFactory(Role, () => {
  const role = new Role();

  role.name = "Super Admin"
  role.description = "The Super Admin Role with full access"
  role.permissions = [
    {
      featureTag: FEATURES.ROLE,
      view: true,
      add: true,
      update: true,
      delete: true,
      approve: true,
      accessLevel: {
        accessLevelTag: ACCESS_LEVEL.GLOBAL,
      }
    } as Permission,
    {
      featureTag: FEATURES.USER,
      view: true,
      add: true,
      update: true,
      delete: true,
      approve: true,
      accessLevel: {
        accessLevelTag: ACCESS_LEVEL.GLOBAL,
      }
    } as Permission,
    {
      featureTag: FEATURES.ORGANIZATIONAL_UNIT,
      view: true,
      add: true,
      update: true,
      delete: true,
      approve: true,
      accessLevel: {
        accessLevelTag: ACCESS_LEVEL.GLOBAL,
      }
    } as Permission
  ]

  role.tenantId = process.env.GLOBAL_TENANT || 'default-tenant-uuid';

  return role;
});
