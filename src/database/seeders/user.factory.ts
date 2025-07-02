import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import * as bcrypt from "bcrypt";

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();

  const bcryptSalt = bcrypt.salt();
  
  user.fName = "Super";
  user.lName = "Admin";
  user.username = "super-admin";
  user.email = process.env.SUPER_ADMIN_EMAIL || 'super-admin@eotcmk.org';
  user.password = bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD || "Pass123", bcryptSalt);
  user.roleId = undefined;
  user.organizationalUnitId = "";
  user.tenantId = process.env.ROOT_TENANT || "f1c59dda-1957-42f3-b80a-0848dbc2050f";

  return user;
});
