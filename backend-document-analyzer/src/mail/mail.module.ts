import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'recrutement.tunisia.dorra@gmail.com',
          pass: 'leyp tige patc tycc',
        },
      },
      defaults: {
        from: '"No Reply" <recrutement.tunisia.dorra@gmail.com>',
      },
      // template: {
      //   dir: join(__dirname, 'templates'),
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}