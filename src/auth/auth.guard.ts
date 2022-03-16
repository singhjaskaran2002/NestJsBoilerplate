import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException,
} from '@nestjs/common';
import { JwtConfigService } from '../jwt-config/jwt-config.service';
import { UserService } from '../user/user.service';
import {
	defaultExcludedAttributes,
	errorMessages,
} from '../common/utils/constants';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly userService: UserService,
		private jwtConfigService: JwtConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		if (!request.headers['authorization']) return false;
		const accessToken = request.headers['authorization'].split(' ')[1];

		let tokenData = this.jwtConfigService.decryptJWT(accessToken);

		if (!tokenData) {
			throw new BadRequestException(errorMessages.JWT_TOKEN_EXPIRED);
		}

		const data = await this.userService.getUser(
			{ id: tokenData.userId, deletedAt: null },
			{ exclude: ['password', ...defaultExcludedAttributes] },
		);

		if (!data) {
			throw new BadRequestException(errorMessages.USER_NOT_FOUND);
		}

		request.user = data.toJSON();
		return true;
	}
}
