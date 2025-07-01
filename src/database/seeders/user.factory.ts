import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entities/user.entity';
import { config } from 'dotenv';
config();

export const UserFactory = setSeederFactory(User, () => {
  const user = new User();

  user.fName = "Super";
  user.lName = "Admin";
  user.username = "super-admin";
  user.email = "super-admin@eotcmk.org";
  user.password = '$2a$10$XFzTN7KSSxO/FT/YnLmhw.2XRHijgpig8sUH5aMLBuM9Fnd8hacpK'; //SuperAdminPassword
  user.roleId = undefined;
  user.organizationalUnitId = "";
  user.tenantId = process.env.ROOT_TENANT || "f1c59dda-1957-42f3-b80a-0848dbc2050f";

  return user;
});
