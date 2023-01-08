import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(
        config: ConfigService
    ) {
        super({
            clientID: config.get('GITHUB_CLIENT_ID'),
            clientSecret: config.get('GITHUB_CLIENT_SECRET'),
            callbackURL: `${config.get('API_URL')}/auth/github/callback`,
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, displayName, provider } = profile
        const user = {
            id,
            firstName: displayName.split(' ')[0] || displayName,
            lastName: displayName.split(' ')[1] || '',
            provider
        }
        done(null, user)
    }
}