import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsString } from 'class-validator';

export class RegisterDto {
	@ApiProperty({ description: "User's email", default: 'abc@example.com' })
	@IsString({ message: 'Please enter valid email.' })
	@IsEmail({}, { message: 'Invalid Email' })
	email: string;

	@ApiProperty({ description: "User's password", default: '123456' })
	@IsString({ message: 'Please enter valid password.' })
	password: string;

    @ApiProperty({ description: "User's name", default: 'john deo' })
	@IsString({ message: 'Please enter valid name.' })
	name: string;
}
