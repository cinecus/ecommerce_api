import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Stock, StockDocument } from 'src/stock/schema/stock.schema';
import {    CreateProductDto } from './dto';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        @InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>
    ){}

    async createProduct(createProductDto:CreateProductDto){
        try {
            //เพิ่มสินค้าใน Product Entity
            const createdProduct = await this.productModel.create(createProductDto)

            //Set Available = 0 ใน Stock Entity
            const createStockProduct = await this.stockModel.create({productID:createdProduct.id,available:0})
            return createdProduct
        } catch (error) {
            throw new Error
        }
    }

    async getAllProduct(){
        try {
            const product = await this.productModel.find()
            return product 
        } catch (error) {
            throw new Error
        }
    }

}
