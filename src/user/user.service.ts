import { Injectable } from '@nestjs/common';
import { User } from './user.interface';

const users: User[] = [
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
	async getUser(email: string, password: string): Promise<User> {
		const user: User = users.filter((item) => item.email === email)[0];
		if (user.password === password) return user;
		else return null;
	}
}
