import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth, AuthSchema } from './schema/auth.schema';
import { GoogleStrategy, JwtStrategy,FacebookStrategy, GithubStrategy, LineStrategy } from './strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,GoogleStrategy,FacebookStrategy,GithubStrategy,LineStrategy]
})
export class AuthModule { }
