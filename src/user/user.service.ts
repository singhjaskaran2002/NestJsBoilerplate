import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAttributeOptions, WhereOptions } from 'sequelize/types';
import { checkHash } from '../helpers/bcrypt.helper';
import { RegisterDto } from './dto/register.dto';
import { User } from './model/user.entity';

@Injectable()
export class UserService {
	constructor(@InjectModel(User) private readonly userModel: typeof User) {}

	// get user by email
	async getUser(
		criteria: WhereOptions,
		attributes?: FindAttributeOptions,
	): Promise<User> {
		return await this.userModel.findOne({
			where: criteria,
			...(attributes && { attributes }),
		});
	}

	// validate the user with email and password
	async validateUser(email: string, password: string): Promise<boolean> {
		const userData = await this.userModel.findOne({
			where: { email },
		});
		if (await checkHash(password, userData.password)) {
			return true;
		}
		return false;
	}

	// create user service method
	async createUser(userData: RegisterDto): Promise<boolean | any> {
		return this.userModel.create(userData);
	}
}
