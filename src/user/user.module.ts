import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../common/models/user.entity';
import { JwtConfigModule } from 'src/jwt-config/jwt-config.module';

@Module({
	imports: [SequelizeModule.forFeature([User]), JwtConfigModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
