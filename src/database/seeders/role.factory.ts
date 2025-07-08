import { setSeederFactory } from 'typeorm-extension';
import { Role } from '../entities/role.entity';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { Permission } from '../entities/permission.entity';

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
      approve: true
    } as Permission,
    {
      featureTag: FEATURES.USER,
      view: true,
      add: true,
      update: true,
      delete: true,
      approve: true,
    } as Permission,
    {
      featureTag: FEATURES.ORGANIZATIONAL_UNIT,
      view: true,
      add: true,
      update: true,
      delete: true,
      approve: true,
    } as Permission
  ]

  return role;
});
