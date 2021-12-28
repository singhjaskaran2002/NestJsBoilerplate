import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { dtoFieldsDescription, dtoFieldsError } from '../../utils/constants';

export class RegisterDto {
	@ApiProperty({
		description: dtoFieldsDescription.USER_EMAIL,
		default: 'abc@example.com',
	})
	@IsEmail({}, { message: 'Invalid Email' })
	email: string;

	@ApiProperty({
		description: dtoFieldsDescription.USER_PASSWORD,
		default: '123456',
	})
	@IsString({
		message: dtoFieldsError.INVALID_FIELD_STRING.replace(
			'@field',
			'password',
		),
	})
	password: string;

	@ApiProperty({
		description: dtoFieldsDescription.USER_NAME,
		default: 'john deo',
	})
	@IsString({
		message: dtoFieldsError.INVALID_FIELD_STRING.replace('@field', 'name'),
	})
	name: string;
}
