import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class AddToCartDto{
    @IsString()
    @IsNotEmpty()
    productID:string

    @IsNumber()
    @IsNotEmpty()
    qty:number
}

