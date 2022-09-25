import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AuthDto{
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsOptional()
    resetPasswordToken: string
}