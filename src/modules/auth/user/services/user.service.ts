import { TEntityCrudService } from '@mk/common/utils/shared-crud.service';
import { User } from '@mk/database/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService extends TEntityCrudService<User> {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
		super(userRepository)
	}

	async create(itemData: CreateUserDto): Promise<User> {
		const { password, ...rest } = itemData;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = this.userRepository.create({
			...rest,
			password: hashedPassword,
		});

		return this.userRepository.save(user);
	}

	async update(id: string, itemData: UpdateUserDto): Promise<User> {
		const user = await this.findOne(id);

		if (!user) {
			throw new NotFoundException("User not found.");
		}

		if (itemData.password) {
			const salt = await bcrypt.genSalt();
			user.password = await bcrypt.hash(itemData.password, salt);
		}

		Object.assign(user, itemData);

		return this.userRepository.save(user);
	}
}
