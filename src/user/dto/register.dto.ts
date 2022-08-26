import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import {
	dtoFieldsDescription,
	dtoFieldsError,
	errorMessages,
} from '../../common/utils/constants';

export class RegisterDto {
	@ApiProperty({
		description: dtoFieldsDescription.USER_EMAIL,
		default: 'abc@example.com',
	})
	@IsEmail({}, { message: 'Invalid Email' })
	email: string;

	@ApiProperty({
		description: dtoFieldsDescription.USER_USERNAME,
		default: 'abc99',
	})
	@IsString({ message: 'Invalid Username' })
	username: string;

	@ApiProperty({
		description: dtoFieldsDescription.USER_IMAGE,
		required: false,
		readOnly: true,
	})
	profilePicture?: string;

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
	@MinLength(8, { message: errorMessages.MIN_PASSWORD_ERROR })
	@MaxLength(20, {
		message: errorMessages.MAX_PASSWORD_ERROR,
	})
	@Matches(/^\S*$/, {
		message: errorMessages.WHITESPACE_PASSWORD_ERROR,
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
