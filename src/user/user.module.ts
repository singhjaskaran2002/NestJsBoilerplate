import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.entity';
import { JwtConfigModule } from 'src/jwt-config/jwt-config.module';
import { EmailHandlerModule } from 'src/email-handler/email-handler.module';

@Module({
	imports: [
		SequelizeModule.forFeature([User]),
		JwtConfigModule,
		EmailHandlerModule,
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
