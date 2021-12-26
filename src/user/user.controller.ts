import {
	Body,
	Controller,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { statusMessages } from '../utils/httpStatuses';
import { createSuccessReponse } from '../utils/response.helper';
import { Response } from '../utils/response.interface';
import { LoginDto } from './dto/login.dto';
import { User } from './user.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('login')
	@ApiOperation({ description: 'Route to login the user' })
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
		const userData: User = await this.userService.getUser(
			body.email,
			body.password,
		);
		return createSuccessReponse('Logged in successfully.', {
			id: userData.id,
			name: userData.name,
		});
	}
}
