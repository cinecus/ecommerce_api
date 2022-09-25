import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AddStockDto } from './dto/addStock.dto';
import { Stock, StockDocument } from './schema/stock.schema';

@Injectable()
export class StockService {
    constructor(
        @InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>
    ){}

    async addStockProduct(addStockDto:AddStockDto){
        try {
            const addedStock = await this.stockModel.findOneAndUpdate(
                {
                    productID:new mongoose.Types.ObjectId(addStockDto.productID)
                },
                {
                    $set:{
                        available:addStockDto.available
                    }
                },
                {
                    upsert:true,
                    new:true
                }
            )
            return addedStock
        } catch (error) {
            throw new Error(error)
        }
    }
}
