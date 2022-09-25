import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as SendGrid from '@sendgrid/mail';
import Debug from 'debug'

const debug = Debug('debugging:')

@Injectable()
export class SendgridService {
    constructor(private readonly configService: ConfigService) {
        SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    }

    async send(mail: SendGrid.MailDataRequired) {
        const transport = await SendGrid.send(mail);

        debug(`Email successfully dispatched to ${mail.to}`)
        return transport;
    }
}
