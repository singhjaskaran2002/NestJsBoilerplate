import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './common/config/configuration';
import { UserModule } from './user/user.module';
import { JwtConfigModule } from './jwt-config/jwt-config.module';
import { EmailHandlerModule } from './email-handler/email-handler.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import * as winston from 'winston';
import {
	utilities as nestWinstonModuleUtilities,
	WinstonModule,
} from 'nest-winston';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: path.join(__dirname, '..', 'public'),
		}),
		UserModule,
		EmailHandlerModule,
		ConfigModule.forRoot({
			load: [configuration],
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				...configService.get<any>('database'),
				sync: {
					alter: true,
					logging: false
				},
				autoLoadModels: true,
			}),
			inject: [ConfigService],
		}),
		JwtConfigModule,
		WinstonModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const enabled = configService.get<boolean>('enableLogs');

				if (enabled) {
					return {
						format: winston.format.combine(
							winston.format.timestamp(),
							winston.format.json(),
							winston.format.align(),
							winston.format.colorize({
								message: true,
								colors: {
									error: 'red',
									warn: 'yellow',
									info: 'cyan',
									debug: 'green',
								},
							}),
						),
						transports: [
							new winston.transports.Console({
								format: winston.format.combine(
									winston.format.timestamp(),
									winston.format.ms(),
									nestWinstonModuleUtilities.format.nestLike(
										'Application_Name',
										{
											prettyPrint: true,
										},
									),
								),
							}),
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.uncolorize(),
									winston.format.label({ label: 'Error' }),
									winston.format.timestamp(),
									winston.format.printf(
										({
											level,
											message,
											label,
											timestamp,
										}) => {
											return `${
												timestamp.split('T')[0]
											} ${new Date(
												timestamp,
											).toLocaleTimeString()}  [${label}] ${level}:${message}`;
										},
									),
								),
								dirname: path.join(
									__dirname,
									'./../log/error/',
								),
								filename: 'error.log',
								level: 'error',
							}),
							new winston.transports.File({
								format: winston.format.combine(
									winston.format.uncolorize(),
									winston.format.label({ label: 'Debug' }),
									winston.format.timestamp(),
									winston.format.printf(
										({
											level,
											message,
											label,
											timestamp,
										}) => {
											return level === 'debug'
												? `${
														timestamp.split('T')[0]
												  } ${new Date(
														timestamp,
												  ).toLocaleTimeString()} [${label}] ${level}: ${message}`
												: '';
										},
									),
								),
								level: 'debug',
								dirname: path.join(
									__dirname,
									'./../log/debug/',
								),
								filename: 'debug.log',
							}),
						],
					};
				} else {
					return {
						format: winston.format.combine(
							winston.format.timestamp(),
							winston.format.json(),
							winston.format.align(),
							winston.format.colorize({
								message: true,
								colors: {
									error: 'red',
									warn: 'yellow',
									info: 'cyan',
									debug: 'green',
								},
							}),
						),
						transports: [
							new winston.transports.Console({
								format: winston.format.combine(
									winston.format.timestamp(),
									winston.format.ms(),
									nestWinstonModuleUtilities.format.nestLike(
										'BSH-App',
										{
											prettyPrint: true,
										},
									),
								),
							}),
						],
					};
				}
			},
			inject: [ConfigService],
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
