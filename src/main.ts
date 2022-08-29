import {
	BadRequestException,
	ValidationError,
	ValidationPipe
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { serverEnvironments } from './common/utils/constants';
import { UserModule } from './user/user.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { httpsOptions: {}, cors: true });

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

	app.use(json({ limit: '1mb' }));
	app.use(urlencoded({ limit: '50mb', extended: true }));

	app.useGlobalFilters(new HttpExceptionFilter());

	// serves swagger if environment is development
	if (process.env.NODE_ENV === serverEnvironments.DEV) {
		const config = new DocumentBuilder()
			.setTitle('Nest BoilerPlate')
			.setVersion('1.0')
			.addBearerAuth()
			.build();
		const document = SwaggerModule.createDocument(app, config, {
			include: [UserModule],
		});
		SwaggerModule.setup(process.env.DEFAULT_SWAGGER_ROUTE, app, document);
	}

	await app.listen(+process.env.SERVER_PORT);
}
bootstrap();
