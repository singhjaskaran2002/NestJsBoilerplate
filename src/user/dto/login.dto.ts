import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
	@ApiProperty({ description: "User's email", default: 'abc@example.com' })
	@IsString({ message: 'Please enter valid email.' })
	@IsEmail({}, { message: 'Invalid Email' })
	email: string;

	@ApiProperty({ description: "User's password", default: '123456' })
	@IsString({ message: 'Please enter valid password.' })
	password: string;
}
