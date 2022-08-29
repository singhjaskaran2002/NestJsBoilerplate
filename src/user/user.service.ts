import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAttributeOptions, WhereOptions } from 'sequelize/types';
import { checkHash } from '../common/helpers/bcrypt.helper';
import { User } from '../models/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

	// get users list
	async getUserList(
		page: number,
		limit: number,
		sortKey: string,
		sortDirection: string,
		criteria?: WhereOptions,
		attributes?: FindAttributeOptions,
	): Promise<{ count: number; rows: User[] }> {
		const offset = page * limit;
		return await this.userModel.findAndCountAll({
			where: criteria,
			...(attributes && { attributes }),
			offset,
			limit,
			order: [[sortKey, sortDirection]],
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
	async createUser(userData: RegisterDto): Promise<User> {
		return this.userModel.create(userData);
	}

	// update user service method
	async updateUser(
		criteria: WhereOptions,
		updatedData: UpdateUserDto,
	): Promise<boolean | any> {
		return this.userModel.update(updatedData, { where: criteria });
	}

	// remove user from database
	async removeUser(criteria: WhereOptions): Promise<any> {
		return await this.userModel.destroy({ where: criteria });
	}

	// destroy record from database
	async destroyRecord(criteria: WhereOptions): Promise<any> {
		return await this.userModel.destroy({ where: criteria, force: true });
	}
}
