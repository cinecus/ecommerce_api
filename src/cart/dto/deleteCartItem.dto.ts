import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class DeleteCartItemDto{
    @IsString()
    @IsNotEmpty()
    cartID:string
}