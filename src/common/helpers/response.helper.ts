import { HttpStatus } from '@nestjs/common';
import { IResponse } from '../intefaces/response.interface';

export function createSuccessReponse(
	message: string = '',
	data?: any,
): IResponse<any> {
	return {
		statusCode: HttpStatus.OK,
		...(message != '' && { message }),
		...(data && { data }),
	};
}
