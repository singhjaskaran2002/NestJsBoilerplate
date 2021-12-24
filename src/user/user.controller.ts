import {
	Body,
	Controller,
	HttpStatus,
	NotFoundException,
	Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { statusMessages } from 'src/utils/httpStatuses';
import { createSuccessReponse } from 'src/utils/response.helper';
import { Response } from 'src/utils/response.interface';
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
	async login(@Body() body: LoginDto): Promise<Response> {
		const userData: User = await this.userService.getUser(
			body.email,
			body.password,
		);
		if (!userData) throw new NotFoundException('User not found!');
		return createSuccessReponse('Logged in successfully.', {
			id: userData.id,
			name: userData.name,
		});
	}
}
