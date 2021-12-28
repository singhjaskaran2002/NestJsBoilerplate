import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

// @ApiTags('SERVER')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	checkServer(): string {
		return '<h1>Server is running.</h1>';
	}
}
