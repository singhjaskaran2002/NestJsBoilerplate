import { Injectable } from '@nestjs/common';
import { User } from './user.interface';

let users: User[] = [
	{
		id: 1,
		email: 'jaskaran@gmail.com',
		password: 'jaskaran',
		name: 'Jaskaran Singh',
	},
];

@Injectable()
export class UserService {
	constructor() {}

	// get user by email
	async getUser(email: string): Promise<User> {
		return users.filter((item: User) => item.email === email)[0];
	}

	// validate the user with email and password
	async validateUser(email: string, password: string): Promise<User> {
		const user = users.filter((item: User) => {
			if (item.email === email && item.password === password) return item;
		})[0];
		if (!user) return null;
		return user;
	}

	async createUser(userData: User): Promise<boolean | any> {
		const id = users.length + 1;
		users.push({ ...userData, id });
		return true;
	}
}
