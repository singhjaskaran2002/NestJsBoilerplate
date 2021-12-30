import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtConfigService } from './jwt-config.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (
				configService: ConfigService,
			): Promise<JwtModuleOptions> => ({
				...configService.get<any>('jwt'),
			}),
			inject: [ConfigService],
		}),
	],
	providers: [JwtConfigService],
	exports: [JwtConfigService],
})
export class JwtConfigModule {}
