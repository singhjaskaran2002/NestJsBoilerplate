import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { Matches, MaxLength, MinLength } from 'class-validator';
import {
	dtoFieldsDescription,
	errorMessages,
} from 'src/common/utils/constants';

export class UpdatePasswordDto {
	@ApiProperty({
		description: dtoFieldsDescription.USER_CURRENT_PASSWORD,
		default: 'test@123',
	})
	currentPassword: string;

	@ApiProperty({
		description: dtoFieldsDescription.USER_NEW_PASSWORD,
		default: 'test@123',
	})
	@MinLength(8, { message: errorMessages.MIN_PASSWORD_ERROR })
	@MaxLength(20, {
		message: errorMessages.MAX_PASSWORD_ERROR,
	})
	@Matches(/^\S*$/, {
		message: errorMessages.WHITESPACE_PASSWORD_ERROR,
	})
	@Transform(({ value }: TransformFnParams) => value.trim())
	newPassword: string;
}
