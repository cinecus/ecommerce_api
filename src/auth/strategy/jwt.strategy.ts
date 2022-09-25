import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AppRequest } from "src/types";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private authService: AuthService
    ) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: AppRequest) => {
                    let token = request?.cookies["accessToken"]
                    if (!token) {
                        return null
                    }
                    return token
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    async validate(payload: { userID: string, tokenVersion: number, iat: number, exp: number }) {

        const user = await this.authService.findUserByID(payload.userID)
        if (user.tokenVersion !== payload.tokenVersion) {
            return null
        }

        return { ...user, ...payload }
    }

}