import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/utils/roles/roles.decorator';
import { Role } from 'src/utils/roles/roles.enum';
import { RolesGuard } from 'src/utils/roles/roles.guard';
import { JwtConfigService } from '../jwt-config/jwt-config.service';
import { AuthGuard } from '../utils/auth.guard';
import { checkHash, encryptPassword } from '../helpers/bcrypt.helper';
import { messages, apiDescriptions, errorMessages } from '../utils/constants';
import { statusMessages } from '../utils/httpStatuses';
import { createSuccessReponse } from '../helpers/response.helper';
import { Response } from '../intefaces/response.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './model/user.entity';
import { UserService } from './user.service';
import { Op } from 'sequelize';

export interface IGetUserAuthInfoRequest extends Request {
	user: User;
}

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtConfigService,
	) {}

	@Post('register')
	@ApiOperation({ description: apiDescriptions.REGISTER_API })
	@ApiResponse({
		status: HttpStatus.OK,
		description: statusMessages[HttpStatus.OK],
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: statusMessages[HttpStatus.BAD_REQUEST],
	})
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() body: RegisterDto): Promise<Response> {
		const { email } = body;

		// check if user exists in the database
		const userData: User = await this.userService.getUser({
			email,
			deletedAt: null,
		});
		if (userData)
			throw new BadRequestException(errorMessages.USER_ALREADY_EXISTS);

		// delete old records in case of having same email
		await this.userService.destroyRecord({ email });

		// create user with provided data
		body.password = await encryptPassword(body.password);
		const isRegistered = await this.userService.createUser(body);
		if (!isRegistered)
			throw new BadRequestException(errorMessages.REGISTERATION_FAILED);
		return createSuccessReponse(messages.REGISTER_SUCCESSFULLY);
	}

	@Post('login')
	@ApiOperation({ description: apiDescriptions.LOGIN_API })
	@ApiResponse({
		status: HttpStatus.OK,
		description: statusMessages[HttpStatus.OK],
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: statusMessages[HttpStatus.NOT_FOUND],
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: statusMessages[HttpStatus.BAD_REQUEST],
	})
	async login(@Body() body: LoginDto): Promise<Response> {
		const { email, password } = body;

		// check if user exists in the database
		const userData: User = await this.userService.getUser({
			email,
			deletedAt: null,
		});

		if (!userData)
			throw new NotFoundException(errorMessages.USER_NOT_FOUND);

		// check if the credentials are valid
		if (!(await checkHash(password, userData.password)))
			throw new BadRequestException(errorMessages.INVALID_PASSWORD);

		const accessToken = this.jwtService.encryptJWT({ userId: userData.id });

		return createSuccessReponse(messages.LOGIN_SUCCESSFULLY, {
			accessToken,
		});
	}

	@ApiSecurity('bearer')
	@Roles(Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	@Get('profile')
	@ApiOperation({ description: apiDescriptions.PROFILE_API })
	@ApiResponse({
		status: HttpStatus.OK,
		description: statusMessages[HttpStatus.OK],
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: statusMessages[HttpStatus.NOT_FOUND],
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: statusMessages[HttpStatus.BAD_REQUEST],
	})
	async profile(@Req() req: IGetUserAuthInfoRequest): Promise<Response> {
		return createSuccessReponse(messages.SUCCESS, req.user);
	}
}
