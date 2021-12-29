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

		if (Array.isArray(exceptionCopy.message)) {
			exceptionCopy.message = exceptionCopy.message.map((item) => {
				let obj: any = {};
				obj = item;
				let errorMessages: string[] = Object.keys(item.constraints).map(
					(constraint) => {
						return item.constraints[constraint];
					},
				);
				delete obj.children;
				delete obj.constraints;
				obj.messages = errorMessages;
				return obj;
			});
		}

		response.status(status).json({
			statusCode: exceptionCopy.statusCode,
			path: request.url,
			statusMessage: exceptionCopy.error,
			messages: exceptionCopy.message,
		});
	}
}
