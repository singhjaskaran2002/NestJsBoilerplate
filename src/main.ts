import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserModule } from './user/user.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());

	const config = new DocumentBuilder()
		.setTitle('Sample API')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [UserModule],
	});
	SwaggerModule.setup('docs', app, document);

	await app.listen(3000);
}
bootstrap();
