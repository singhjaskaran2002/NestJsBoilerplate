import { HttpStatus } from '@nestjs/common';
import { Response } from '../intefaces/response.interface';

export function createSuccessReponse(
	message: string = '',
	data?: any,
): Response {
	return {
		statusCode: HttpStatus.OK,
		...(message != '' && { message }),
		...(data && { data }),
	};
}
