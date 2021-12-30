import {
	Inject,
	Injectable,
	LoggerService,
	NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		private readonly logger: LoggerService,
	) {}
	use(req: Request, _: Response, next: NextFunction) {
		this.logger.debug(`[Route] ${req.originalUrl} [Method] ${req.method}`);
		next();
	}
}
