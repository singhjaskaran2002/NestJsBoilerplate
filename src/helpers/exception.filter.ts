import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		const exceptionCopy = JSON.parse(
			JSON.stringify(exception.getResponse()),
		);

		exceptionCopy.message = exceptionCopy.message.map((item) => {
			delete item.children;
			return item;
		});

		response.status(status).json({
			messages: exceptionCopy.message,
			error: exceptionCopy.error,
			// path: request.url,
		});
	}
}
