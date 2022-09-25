import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class AddStockDto{
    @IsString()
    @IsNotEmpty()
    productID: string

    @IsNumber()
    @IsNotEmpty()
    available: number

}