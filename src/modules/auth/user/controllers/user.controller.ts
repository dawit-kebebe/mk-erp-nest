import { JwtAuthGuard } from '@mk/common/guards/jwt.guard';
import { TenancyGuard } from '@mk/common/guards/tenancy.guard';
import { TEntityCrudController } from '@mk/common/utils/shared-crud.controller';
import { User } from '@mk/database/entities/user.entity';
import { Controller, Inject, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { RespondUserDto } from '../dto/respond-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
@UseGuards(JwtAuthGuard, TenancyGuard)
export class UserController extends TEntityCrudController<User>({
    createDto: CreateUserDto,
    updateDto: UpdateUserDto,
    responseDto: RespondUserDto,
    entityName: "User"
}){
  constructor(@Inject() private readonly userService: UserService) {
    super(userService);
  }
}