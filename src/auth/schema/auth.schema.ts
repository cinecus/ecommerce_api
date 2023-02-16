import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Cart } from 'src/cart/schema/cart.schema';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    email: string;

    @Prop()
    thirdPartyEmail: string;

    @Prop()
    password: string; 

    @Prop()
    googleID:string;

    @Prop()
    facebookID:string;

    @Prop()
    githubID:string;

    @Prop()
    lineID:string;

    @Prop()
    provider:string;

    @Prop({default:0})
    tokenVersion: number;

    @Prop()
    resetPasswordToken?: string  | null;

    @Prop()
    resetPasswordTokenExpiry?: number  | null;

    @Prop({default:()=>Date.now()+60*60*1000*7})
    createdAt:Date

    @Prop({
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Cart',
        default:[]
    })
    cart: [Cart]
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

// AuthSchema.pre(/^find/,function(next){
//     this.populate('cart')
    
//     next()
// })