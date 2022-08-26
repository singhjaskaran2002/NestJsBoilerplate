import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
	Put,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import {
	ApiOperation,
	ApiResponse,
	ApiSecurity,
	ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtConfigService } from '../jwt-config/jwt-config.service';
import { AuthGuard } from '../auth/auth.guard';
import { checkHash, encryptPassword } from '../common/helpers/bcrypt.helper';
import {
	messages,
	apiDescriptions,
	errorMessages,
} from '../common/utils/constants';
import { statusMessages } from '../common/utils/httpStatuses';
import { createSuccessReponse } from '../common/helpers/response.helper';
import { IResponse } from '../common/intefaces/response.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../models/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailHandlerService } from 'src/email-handler/email-handler.service';
import { mailSubjects, mailTypes } from 'src/email-handler/templatesIndex';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fetchImageUrl } from 'src/common/utils/fetchImageUrl';
import { IUser } from 'src/common/intefaces/user.interface';

export interface IGetUserAuthInfoRequest extends Request {
	user: User;
}

@ApiTags('User')
@UseInterceptors(LoggingInterceptor)
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtConfigService,
		private readonly emailService: EmailHandlerService,
	) {}

	/**
	 * Register user
	 */
	@Post('')
	@ApiOperation({ description: apiDescriptions.REGISTER_API })
	@ApiResponse({
		status: HttpStatus.OK,
		description: statusMessages[HttpStatus.OK],
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: statusMessages[HttpStatus.BAD_REQUEST],
	})
	@UseInterceptors(
		AnyFilesInterceptor({
			storage: diskStorage({
				destination: './public/uploads',
				filename: (req, file, cb) => {
					const ext = file.originalname.split('.');
					req.body.profilePicture = `${req.body.username}.${
						ext[ext.length - 1]
					}`;
					cb(null, `${req.body.username}.${ext[ext.length - 1]}`);
				},
			}),
		}),
	)
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() body: RegisterDto): Promise<IResponse<IUser>> {
		const { email } = body;

		// check if user exists in the database
		const userData: User = await this.userService.getUser({
			email,
			deletedAt: null,
		});
		if (userData)
			throw new BadRequestException(errorMessages.USER_ALREADY_EXISTS);

		// create user with provided data
		body.password = await encryptPassword(body.password);

		const isRegistered = await this.userService.createUser(body);
		if (!isRegistered)
			throw new BadRequestException(errorMessages.REGISTERATION_FAILED);

		// send welcome mail
		this.emailService.sendMail(
			mailTypes.welcome_mail,
			mailSubjects.welcome_mail,
			email,
			{
				username: body.name,
				welcome_logo:
					'https://mpng.subpng.com/20190320/xyo/kisspng-welcome-image-logo-portable-network-graphics-text-country-time-accueil-5c92636a4c2dc5.468162921553097578312.jpg',
			},
		);

		return createSuccessReponse(messages.REGISTER_SUCCESSFULLY);
	}

	/**
	 * Login endpoint
	 */
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
	async login(@Body() body: LoginDto): Promise<IResponse<IUser>> {
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

	/**
	 * get profile
	 */
	@ApiSecurity('bearer')
	@Roles(Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	@Get('')
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
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: statusMessages[HttpStatus.FORBIDDEN],
	})
	async profile(@Req() req: IGetUserAuthInfoRequest): Promise<IResponse<IUser>> {
		let userData = await this.userService.getUser({
			username: req.user.username,
		});
		userData = userData.toJSON();
		if (userData.profilePicture)
			userData.profilePicture = fetchImageUrl(userData.profilePicture);
		return createSuccessReponse(messages.SUCCESS, userData);
	}
	/**
	 * Update profile
	 */
	@ApiSecurity('bearer')
	@Roles(Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	@Put('')
	@ApiOperation({ description: apiDescriptions.UPDATE_USER_API })
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
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: statusMessages[HttpStatus.FORBIDDEN],
	})
	@UseInterceptors(
		AnyFilesInterceptor({
			storage: diskStorage({
				destination: './public/uploads',
				filename: (req: IGetUserAuthInfoRequest, file, cb) => {
					const ext = file.originalname.split('.');
					req.body.profilePicture = `${req.user.username}.${
						ext[ext.length - 1]
					}`;
					cb(null, `${req.user.username}.${ext[ext.length - 1]}`);
				},
			}),
		}),
	)
	async updateProfile(
		@Body() body: UpdateUserDto,
		@Req() req: IGetUserAuthInfoRequest,
	): Promise<IResponse<IUser>> {
		await this.userService.updateUser({ id: req.user.id }, body);
		return createSuccessReponse(messages.PROFILE_UPDATED_SUCCESSFULLY);
	}

	/**
	 * Change password endpoint
	 */
	@ApiSecurity('bearer')
	@Roles(Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	@Put('change-password')
	@ApiOperation({ description: apiDescriptions.CHANGE_PASSWORD_API })
	@ApiResponse({
		status: HttpStatus.OK,
		description: statusMessages[HttpStatus.OK],
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: statusMessages[HttpStatus.BAD_REQUEST],
	})
	@ApiResponse({
		status: HttpStatus.FORBIDDEN,
		description: statusMessages[HttpStatus.FORBIDDEN],
	})
	async changeProfile(
		@Body() body: ChangePasswordDto,
		@Req() req: IGetUserAuthInfoRequest,
	): Promise<IResponse<IUser>> {
		// password and newPassword from body.
		const { password, newPassword } = body;

		// E-mail info from user context.
		const { id } = req.user;
		const user = await this.userService.getUser({ id }, ['password']);

		// Fetch users Old Password.
		const { password: oldPassword } = user;

		// Authenticate User.
		if (!(await checkHash(password, oldPassword))) {
			throw new BadRequestException(
				errorMessages.OLD_PASSWORD_NOT_MATCHED,
			);
		}

		// Hash the password.
		const hashedPassword = await encryptPassword(newPassword);

		// check if entered passwords are same.
		if (await checkHash(newPassword, oldPassword)) {
			throw new BadRequestException(
				errorMessages.SAME_OLD_AND_NEW_PASSWORD,
			);
		}

		// Finally update password. if all conditions passed.
		await this.userService.updateUser({ id }, { password: hashedPassword });
		return createSuccessReponse(messages.SUCCESS);
	}
}
