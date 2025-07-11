import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import * as bcrypt from "bcrypt";

export const UserFactory = setSeederFactory(User, async () => {
  const user = new User();

  const bcryptSalt = await bcrypt.genSalt();
  
  user.fName = "Super";
  user.lName = "Admin";
  user.username = "super-admin";
  user.email = process.env.SUPER_ADMIN_EMAIL || 'super-admin@eotcmk.org';
  user.password = bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD || "Pass123", bcryptSalt);
  user.roleId = undefined;
  user.organizationalUnitId = "";
  user.tenantId = process.env.GLOBAL_TENANT || "f1c59dda-1957-42f3-b80a-0848dbc2050f";

  return user;
});
