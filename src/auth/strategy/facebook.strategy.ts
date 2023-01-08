import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        config: ConfigService
    ) {
        super({
            clientID: config.get('FACEBOOK_APP_ID'),
            clientSecret: config.get('FACEBOOK_APP_SECRET'),
            callbackURL: `${config.get('API_URL')}/auth/facebook/callback`,
            profileFields: ['id', 'email', 'displayName', 'name'],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, name, provider } = profile
        const user = {
            id,
            firstName: name.givenName,
            lastName: name.familyName,
            provider
        }

        done(null, user)
    }
}