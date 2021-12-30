import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as HANDLEBARS from 'handlebars';
import { mailTemplates } from './templatesIndex';
import * as fs from 'fs';

@Injectable()
export class EmailHandlerService {
	constructor(private mailerService: MailerService) {}

	async sendMail(
		type: string,
		subject: string,
		to: string,
		data: any,
	): Promise<any> {
		const source = await fs.readFileSync(
			'public/templates/' + mailTemplates[type],
		);
		const html = this.compileTemplate(source.toString(), data);
		return await this.mailerService.sendMail({
			to,
			subject,
			html,
		});
	}

	// common method for compiling templates with data
	private compileTemplate(source: string, data: any) {
		return HANDLEBARS.compile(source)(data);
	}
}
