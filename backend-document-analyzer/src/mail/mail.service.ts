import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateCandidatDto } from 'src/candidat/dto/create-candidat.dto';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(full_name: string, email: string, id: number) {
    const url = 'http://localhost:3000/upload/'+full_name+'/'+ id;
    console.log(full_name);
    const htmlContent = fs.readFileSync('src/mail/mail.html', 'utf8');
    const replacedHtmlContent = htmlContent
      .replace('{{name}}', full_name)
      .replace('{{url}}', url)
      ;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to app!',
      html: replacedHtmlContent,
      context: {
        name: full_name,
        url,
      },
    });
  }
}
