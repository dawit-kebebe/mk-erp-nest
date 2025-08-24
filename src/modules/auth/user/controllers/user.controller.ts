import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { RoleGuard } from '@mk/common/guards/role.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { TEntityCrudController } from '@mk/common/utils/shared-crud.controller';
import { User } from '@mk/database/entities/user.entity';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { RespondUserDto } from '../dto/respond-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { RequiredPermissions } from '@mk/common/decorators/RequiredPermission';
import { FEATURES } from '@mk/common/enum/feature.enum';
import { UserGuard } from '@mk/common/guards/user.guard';

@Controller('user')
@RequiredPermissions(FEATURES.USER)
@UseGuards(JwtAuthGuard, TenancyGuard, RoleGuard, UserGuard)
export class UserController extends TEntityCrudController<User>({
    createDto: CreateUserDto,
    updateDto: UpdateUserDto,
    responseDto: RespondUserDto,
    entityName: "User"
}){
  constructor(@Inject() private readonly userService: UserService) {
    super(userService);
  }

  @Get('/myprofile')
  @RequiredPermissions()
  getMyProfile() {
    return this.userService.getMyProfile();
  }
}