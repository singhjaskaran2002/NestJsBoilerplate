import { Module } from '@nestjs/common';
import { EmailHandlerService } from './email-handler.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				return {
					...configService.get<any>('mailerOptions'),
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [EmailHandlerService],
	exports: [EmailHandlerService],
})
export class EmailHandlerModule {}
