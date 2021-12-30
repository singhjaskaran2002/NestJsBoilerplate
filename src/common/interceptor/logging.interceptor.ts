import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Inject,
	LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		private readonly logger: LoggerService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		this.logger.debug(
			`[Controller] ${context.getClass().name}  [Caller] ${
				context.getHandler().name
			} [Path]  ${context.getArgByIndex(1).req.route.path}  [Method]  ${
				context.getArgByIndex(1).req.route.stack[0].method
			}`,
		);
		return next.handle().pipe(map((data) => data));
	}
}
