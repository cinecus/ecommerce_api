import { Body, Controller, Post, HttpStatus, HttpCode, Res, Get, UseGuards, Req, Inject } from '@nestjs/common';
import { ResponseService } from 'src/response/response.service';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcryptjs'
import { FacebookGuard, GithubGuard, GoogleGuard, JwtGuard } from './guard';
import { GetUser } from './decorator';
import { randomBytes } from 'crypto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private response: ResponseService
    ) {

    }

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    async signup(
        @Body() dto: AuthDto,
        @Res({ passthrough: true }) response: Response
    ) {
        try {
            dto.password = await bcrypt.hashSync(dto.password, bcrypt.genSaltSync(10))
            const user = await this.authService.signup(dto)
            //ถ้าถูก genToken ด้วยส่งให้
            const { accessToken } = await this.authService.signToken(user.id, user.tokenVersion)
            await this.authService.sendToken(response, accessToken)

            delete user.password

            return this.response.success('เข้าสู่ระบบแล้ว', user)
        } catch (error) {
            return this.response.failed(error)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(
        @Body() dto: Pick<AuthDto, "email" | "password">,
        @Res({ passthrough: true }) response: Response
    ) {
        try {
            //ค้นหา user 
            const user = await this.authService.findUser({ email: dto.email })
            //ถ้าไม่เจอ แจ้งว่า Email หรือ Password ไม่ถูกต้อง
            if (!user) {
                return this.response.failed('Email หรือ Password ไม่ถูกต้อง')
            }
            //verify password
            const pwMatches = await bcrypt.compareSync(dto.password, user.password)

            //ถ้า Password ไม่ถูกต้อง แจ้งว่า Email หรือ Password ไม่ถูกต้อง
            if (!pwMatches) {
                return this.response.failed('Email หรือ Password ไม่ถูกต้อง')
            }

            //ถ้าถูก genToken ด้วยส่งให้
            const { accessToken } = await this.authService.signToken(user.id, user.tokenVersion)
            await this.authService.sendToken(response, accessToken)

            delete user.password

            return this.response.success('เข้าสู่ระบบแล้ว', user)

        } catch (error) {
            return this.response.failed(error)
        }
    }

    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    async me(
        @GetUser('userID') userID: string
    ) {
        try {
            const user = (await this.authService.findUserByID(userID)).toObject()

            delete user.password
            return this.response.success('ดึงข้อมูลผู้ใช้สำเร็จ', user)
        } catch (error) {
            return this.response.failed(error)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('requestResetPassword')
    async requestResetPassword(
        @Body() dto: Pick<AuthDto, 'email'>
    ) {
        try {

            // ตรวจสอบว่ามี Email นี้ใน User คนไหน
            const user = await this.authService.findUser(dto)

            if (!user) {
                return this.response.failed('ไม่พบ Email นี้ในระบบ')
            }

            //genToken ในการ Reset Password
            const resetPasswordToken = randomBytes(16).toString('hex')
            const resetPasswordTokenExpiry = Date.now() + 1000 * 60 * 30

            //Update resetPasswordToken กับ resetPasswordTokenExpiry ของ User
            const updatedUser = await this.authService.updateResetPasswordToken(dto.email, resetPasswordToken, resetPasswordTokenExpiry)

            //3rd Party Send Email
            const response = await this.authService.sendEmail(dto.email, resetPasswordToken)

            return this.response.success('ดึงข้อมูลผู้ใช้สำเร็จ', response)
        } catch (error) {
            return this.response.failed(error)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('resetPassword')
    async resetPassword(
        @Body() dto: { password: string, token: string }
    ) {
        try {
            //ค้นหา user
            const user = await this.authService.findUser({ resetPasswordToken: dto.token })

            //ตรวจสอบความถูกต้อง
            if (!user) return this.response.failed('คำขอรีเซ็ตรหัสผ่านไม่ถูกต้อง')

            if (!user.resetPasswordTokenExpiry) return this.response.failed('คำขอรีเซ็ตรหัสผ่านไม่ถูกต้อง')

            //ตรวจสอบว่า token หมดเวลาแล้วหรือไม่
            const isTokenValid = Date.now() < user.resetPasswordTokenExpiry

            if (!isTokenValid) return this.response.failed('token หมดอายุแล้ว')

            const hashedPassword = await bcrypt.hash(dto.password, 10)

            const updatedUser = (await this.authService.updateResetPassword({ email: user.email, password: hashedPassword })).toObject()

            delete updatedUser.password

            return this.response.success('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว', updatedUser)
        } catch (error) {
            return this.response.failed(error)
        }

    }

    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @Post('signout')
    async signout(
        @Res({ passthrough: true }) response: Response,
        @GetUser('userID') userID: string
    ) {
        try {
            const user = await this.authService.findUserByID(userID)

            user.tokenVersion = user.tokenVersion + 1

            await user.save()

            response.clearCookie('accessToken')

            return this.response.success('ออกจากระบบแล้ว', null)

        } catch (error) {
            return this.response.failed(error)
        }
    }

    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    @Get('google')
    async googleAuth() {

    }

    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    @Get('google/callback')
    async googleAuthRedirect(@Req() req, @Res() res) {
        this.authService.googleAuthenticate(req, res)
    }

    @UseGuards(FacebookGuard)
    @HttpCode(HttpStatus.OK)
    @Get('facebook')
    async facebookAuth() {

    }

    @UseGuards(FacebookGuard)
    @HttpCode(HttpStatus.OK)
    @Get('facebook/callback')
    async facebookAuthRedirect(@Req() req, @Res() res) {
        this.authService.facebookAuthenticate(req, res)
    }

    @UseGuards(GithubGuard)
    @HttpCode(HttpStatus.OK)
    @Get('github')
    async githubAuth() {

    }

    @UseGuards(GithubGuard)
    @HttpCode(HttpStatus.OK)
    @Get('github/callback')
    async githubAuthRedirect(@Req() req, @Res() res) {
        this.authService.githubAuthenticate(req, res)
    }
}
