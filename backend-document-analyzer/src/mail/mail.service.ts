import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(full_name: string, email: string, id: number) {
    const url = `http://localhost:${process.env.REACTJS_APP_DOCKER_PORT}/chatbot/`+full_name+'/'+ id;    
    const htmlContent = fs.readFileSync('src/mail/mail.html', 'utf8');
    const replacedHtmlContent = htmlContent
      .replace('{{name}}', full_name)
      .replace('{{url}}', url)
      ;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Request to upload documents from Talan Consulting',
      html: replacedHtmlContent,
      context: {
        name: full_name,
        url,
      },
    });
  }
}
