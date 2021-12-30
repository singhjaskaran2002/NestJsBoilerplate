import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import { dtoFieldsError } from 'src/common/utils/constants';

export class ChangePasswordDto {
	@ApiProperty({ description: "User's password", default: 'test@123' })
	@IsString({
		message: dtoFieldsError.INVALID_FIELD_STRING.replace(
			'@field',
			'password',
		),
	})
	// @IsNotEmpty({ message: fieldError('Password') })
	@Transform(({ value }: TransformFnParams) => value.trim())
	password: string;

	@ApiProperty({ description: "User's new password", default: 'test@123' })
	// @IsNotEmpty({ message: fieldError('New password field') })
	@IsString({
		message: dtoFieldsError.INVALID_FIELD_STRING.replace(
			'@field',
			'New Password',
		),
	})
	@MinLength(8, { message: 'Password must not be smaller than 8 characters' })
	@MaxLength(20, {
		message: 'Password must not be greater than 20 characters',
	})
	@Matches(/^\S*$/, {
		message: 'Please enter a password with no whitespace characters',
	})
	@Transform(({ value }: TransformFnParams) => value.trim())
	newPassword: string;
}
