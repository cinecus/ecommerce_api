import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    @Prop()
    name: string;

    @Prop()
    price: number;

    @Prop()
    image:string;

    @Prop()
    tags?:string[]

    @Prop({default:()=>Date.now()+60*60*1000*7})
    createdAt:Date
}


export const ProductSchema = SchemaFactory.createForClass(Product);