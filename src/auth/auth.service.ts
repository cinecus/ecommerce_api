import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { Auth, AuthDocument } from './schema/auth.schema';
import { JwtService } from '@nestjs/jwt';
import { Cart, CartDocument } from 'src/cart/schema/cart.schema';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { MailDataRequired } from '@sendgrid/mail'
import { AppRequest, AppContext } from 'src/types';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
        private readonly sendgridService: SendgridService,
        private config: ConfigService
    ) { }

    async signup(dto: AuthDto) {
        //ตรวจสอบ email ถ้าไม่ซ้ำ
        const user = await this.authModel.findOne({ email: dto.email })
        if (!user) {
            const signupUser = await this.authModel.create(dto)
            delete signupUser.password
            return signupUser
        } else {
            return Promise.reject('Email นี้มีผู้ใช้งานในระบบแล้ว')
        }
    }


    async findUser(dto: Partial<AuthDto>) {
        const user = await this.authModel.findOne(dto)
        return user
    }

    async findUserByID(id: string) {
        const user = await this.authModel.findById(new mongoose.Types.ObjectId(id))
        return user
    }

    async signToken(userID: string, tokenVersion: number): Promise<{ accessToken: string }> {
        const payload = {
            userID,
            tokenVersion
        }
        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(
            payload, {
            expiresIn: '1day',
            secret: secret
        }
        )

        return {
            accessToken: token
        }
    }

    async sendToken(res: Response, token: string) {
        res.cookie('accessToken', token, { httpOnly: true })
        return
    }

    async updateResetPasswordToken(email: AuthDto['email'], resetPasswordToken: string, resetPasswordTokenExpiry: number) {
        const updatedUser = await this.authModel.findOneAndUpdate({ email: email }, { resetPasswordToken, resetPasswordTokenExpiry }, { new: true })

        return updatedUser
    }

    async sendEmail(email: AuthDto['email'], resetPasswordToken: string) {

        const message: MailDataRequired = {
            from: 'chananon.cine@gmail.com',
            to: email,
            subject: 'Reset password (CC Store)',
            html: `
                <div>
                    <p>Please click below link to reset your password.</p>
                    <a href='${this.config.get('FRONTEND_URI')}/?resetToken=${resetPasswordToken}' target='blank'>Click to reset password</a>
                </div>
            `
        }

        const response = await this.sendgridService.send(message)
        if (!response || response[0]?.statusCode !== 202) throw new Error('Sorry, cannot proceed')

        return { message: 'Please check your email to reset password' }
    }

    async updateResetPassword(dto: Pick<AuthDto, 'email' | 'password'>) {
        const updatedUser = await this.authModel.findOneAndUpdate(
            { email: dto.email },
            { password: dto.password, resetPasswordToken: null, resetPasswordTokenExpiry: null },
            { new: true }
        )

        return updatedUser

    }

    async googleAuthenticate(req: AppRequest, res: Response) {

        const { id, email, firstName, lastName, provider } = req.user
        try {
            //ตรวจสอบว่า user นั้นเคยลงทะเบียนแล้วหรือยัง?
            const user = await this.authModel.findOne({ googleID: id })

            let token: string

            if (!user) {
                //new User
                const newUser = await this.authModel.create({
                    firstName,
                    lastName,
                    thirdPartyEmail: email,
                    provider,
                    googleID: id,
                })

                await newUser.save()
                // Create token
                token = (await this.signToken(newUser.id, newUser.tokenVersion)).accessToken

                // Send token to frontend
                this.sendToken(res, token)

                res.redirect(`${this.config.get('FRONTEND_URI')}`)
            } else {
                //Old User

                // Create token
                token = (await this.signToken(user.id, user.tokenVersion)).accessToken

                // Send token to frontend
                this.sendToken(res, token)

                res.redirect(`${this.config.get('FRONTEND_URI')}`)
            }

        } catch (error) {
            res.redirect(`${this.config.get('FRONTEND_URI')}`!)
        }
    }

    async facebookAuthenticate(req: AppRequest, res: Response) {

        const { id, firstName, lastName, provider } = req.user
        try {
            //ตรวจสอบว่า user นั้นเคยลงทะเบียนแล้วหรือยัง?
            const user = await this.authModel.findOne({ facebookID: id })

            let token: string

            if (!user) {
                //new User
                const newUser = await this.authModel.create({
                    firstName,
                    lastName,
                    provider,
                    facebookID: id,
                })

                await newUser.save()
                // Create token
                token = (await this.signToken(newUser.id, newUser.tokenVersion)).accessToken

                // Send token to frontend
                this.sendToken(res, token)

                res.redirect(`${this.config.get('FRONTEND_URI')}`)
            } else {
                //Old User

                // Create token
                token = (await this.signToken(user.id, user.tokenVersion)).accessToken

                // Send token to frontend
                this.sendToken(res, token)

                res.redirect(`${this.config.get('FRONTEND_URI')}`)
            }

        } catch (error) {
            res.redirect(`${this.config.get('FRONTEND_URI')}`!)
        }
    }

    async githubAuthenticate(req: AppRequest, res: Response) {
        const { id, firstName, lastName, provider } = req.user
        try {
            //ตรวจสอบว่า user นั้นเคยลงทะเบียนแล้วหรือยัง?
            const user = await this.authModel.findOne({ githubID: id })

            let token: string

            if (!user) {
                //new User
                const newUser = await this.authModel.create({
                    firstName,
                    lastName,
                    provider,
                    githubID: id,
                })

                await newUser.save()
                // Create token
                token = (await this.signToken(newUser.id, newUser.tokenVersion)).accessToken

                // Send token to frontend
                this.sendToken(res, token)

                res.redirect(`${this.config.get('FRONTEND_URI')}`)
            } else {
                //Old User

                // Create token
                token = (await this.signToken(user.id, user.tokenVersion)).accessToken

                // Send token to frontend
                this.sendToken(res, token)

                res.redirect(`${this.config.get('FRONTEND_URI')}`)
            }

        } catch (error) {
            res.redirect(`${this.config.get('FRONTEND_URI')}`!)
        }

    }

    async lineAuthenticate(req: AppRequest, res: Response) {
        const { id, firstName, lastName, provider } = req.user
        try {
            //ตรวจสอบว่า user นั้นเคยลงทะเบียนแล้วหรือยัง?
            const user = await this.authModel.findOne({ lineID: id })

            let token: string

            if (!user) {
                //new User
                const newUser = await this.authModel.create({
                    firstName,
                    lastName,
                    provider,
                    lineID: id,
                })

                await newUser.save()
                // Create token
                token = (await this.signToken(newUser.id, newUser.tokenVersion)).accessToken

                // Send token to frontend
                this.sendToken(res, token)

                res.redirect(`${this.config.get('FRONTEND_URI')}`)
            } else {
                //Old User

                // Create token
                token = (await this.signToken(user.id, user.tokenVersion)).accessToken

                // Send token to frontend
                this.sendToken(res, token)

                res.redirect(`${this.config.get('FRONTEND_URI')}`)
            }

        } catch (error) {
            res.redirect(`${this.config.get('FRONTEND_URI')}`!)
        }

    }
}
