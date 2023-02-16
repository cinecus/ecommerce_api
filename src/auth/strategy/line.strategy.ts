import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-line-auth'

@Injectable()
export class LineStrategy extends PassportStrategy(Strategy, 'line') {
    constructor(
        config: ConfigService
    ) {
        super({
            channelID: config.get('LINE_CLIENT_ID'),
            channelSecret: config.get('LINE_CLIENT_SECRET'),
            callbackURL: `${config.get('API_URL')}/auth/line/callback`,
            scope: ['profile', 'openid', 'email'],
            botPrompt: 'normal',
            uiLocales: 'en-US',
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, cb: any): Promise<any> {
        const {id,displayName,provider} = profile
        const user = {
            id,
            firstName: displayName.split(' ')[0] || displayName,
            lastName: displayName.split(' ')[1] || '',
            provider
        }
        cb(null, user);
    }
}