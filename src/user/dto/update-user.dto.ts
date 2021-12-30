import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
	dtoFieldsDescription,
	dtoFieldsError,
} from '../../common/utils/constants';

export class UpdateUserDto {
	@ApiProperty({
		description: dtoFieldsDescription.USER_NAME,
		default: 'john deo',
	})
	@IsString({
		message: dtoFieldsError.INVALID_FIELD_STRING.replace('@field', 'name'),
	})
	name: string;
}
