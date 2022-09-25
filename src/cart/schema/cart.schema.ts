import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {  Product } from 'src/product/schema/product.schema';
import { Auth,AuthSchema } from 'src/auth/schema/auth.schema';
export type CartDocument = Cart & Document;

@Schema()
export class Cart {
    @Prop({
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    })
    productID: Product

    @Prop({
        type:mongoose.Schema.Types.ObjectId,
        ref:'Auth'
    })
    userID: Auth

    @Prop()
    qty:number;

    @Prop({default:()=>Date.now()+60*60*1000*7})
    createdAt:Date
}



export const CartSchema = SchemaFactory.createForClass(Cart);

