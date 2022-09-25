import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateProductDto{
    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    price:number

    @IsString()
    @IsNotEmpty()
    image:String

    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    tags?: String[]

  
}