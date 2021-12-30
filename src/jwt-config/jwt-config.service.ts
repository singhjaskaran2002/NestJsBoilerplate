import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

interface JwtPayload {
	userId: number;
}

interface JwtReturnData {
	userId: number;
	iat: number;
	exp: number;
}

@Injectable()
export class JwtConfigService {
	constructor(private readonly jwtService: JwtService) {}

	// sign token service method
	encryptJWT(payload: JwtPayload): string {
		const validity = +process.env.JWT_VALIDITY_IN_HOURS;
		const expireAt = new Date(
			new Date().setHours(new Date().getHours() + validity),
		);
		return this.jwtService.sign({ ...payload, expireAt });
	}

	// sign token service method
	decryptJWT(token: string): JwtReturnData {
		const tokenData = this.jwtService.verify(token);
		if (moment(tokenData.expireAt).isBefore(new Date())) {
			return null;
		}
		return tokenData;
	}
}
