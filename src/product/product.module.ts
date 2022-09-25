import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from 'src/stock/schema/stock.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },{ name: Stock.name, schema: StockSchema }]),
      ],
      controllers: [ProductController],
      providers: [ProductService]
})
export class ProductModule {}
