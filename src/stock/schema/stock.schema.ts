import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../../product/schema/product.schema';

export type StockDocument = Stock & Document;

@Schema()
export class Stock {
    @Prop({
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    })
    productID: Product

    @Prop()
    available: number;
}


export const StockSchema = SchemaFactory.createForClass(Stock);