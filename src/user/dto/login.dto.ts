import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { dtoFieldsDescription, dtoFieldsError } from '../../utils/constants';

export class LoginDto {
	@ApiProperty({
		description: dtoFieldsDescription.USER_EMAIL,
		default: 'abc@example.com',
	})
	@IsEmail({}, { message: dtoFieldsError.INVALID_EMAIL })
	email: string;

	@ApiProperty({ description: dtoFieldsDescription.USER_PASSWORD, default: '123456' })
	@IsString({
		message: dtoFieldsError.INVALID_FIELD_STRING.replace(
			'@field',
			'password',
		),
	})
	password: string;
}
