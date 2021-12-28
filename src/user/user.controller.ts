import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages, apiDescriptions, errorMessages } from '../utils/constants';
import { statusMessages } from '../utils/httpStatuses';
import { createSuccessReponse } from '../utils/response.helper';
import { Response } from '../utils/response.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

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
		const userData: User = await this.userService.getUser(email);
		if (userData)
			throw new BadRequestException(errorMessages.USER_ALREADY_EXISTS);

		// create user with provided data
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
		const userData: User = await this.userService.getUser(email);
		if (!userData)
			throw new NotFoundException(errorMessages.USER_NOT_FOUND);
		const isValidated = await this.userService.validateUser(
			email,
			password,
		);

		// check if the credentials are valid
		if (!isValidated)
			throw new BadRequestException(errorMessages.INVALID_PASSWORD);
		return createSuccessReponse(messages.LOGIN_SUCCESSFULLY, {
			id: userData.id,
			name: userData.name,
		});
	}
}
