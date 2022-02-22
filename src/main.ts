import {
	BadRequestException,
	ValidationError,
	ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { UserModule } from './user/user.module';
import { serverEnvironments } from './common/utils/constants';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				return new BadRequestException(validationErrors);
			},
			validationError: {
				target: false,
				value: false,
			},
		}),
	);

	app.useGlobalFilters(new HttpExceptionFilter());

	// serves swagger if environment is development
	if (process.env.NODE_ENV === serverEnvironments.DEV) {
		const config = new DocumentBuilder()
			.setTitle('Sample API')
			.setVersion('1.0')
			.addBearerAuth()
			.build();
		const document = SwaggerModule.createDocument(app, config, {
			include: [UserModule],
		});
		SwaggerModule.setup('api-docs', app, document);
	}

	await app.listen(+process.env.SERVER_PORT);
}
bootstrap();
