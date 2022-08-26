import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
	dtoFieldsDescription,
	dtoFieldsError,
} from '../../common/utils/constants';

export class UpdateUserDto {
	@ApiProperty({
		description: dtoFieldsDescription.USER_NAME,
		default: 'john deo',
		required: false,
	})
	@IsOptional()
	@IsString({
		message: dtoFieldsError.INVALID_FIELD_STRING.replace('@field', 'name'),
	})
	name?: string;

	@ApiProperty({
		description: dtoFieldsDescription.USER_IMAGE,
		required: false,
		readOnly: true,
	})
	profilePicture?: string;
}
