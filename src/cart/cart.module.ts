import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/auth/schema/auth.schema';
import { Stock, StockSchema } from 'src/stock/schema/stock.schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './schema/cart.schema';

@Module({
    imports:[
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
        MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
        MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),

    ],
    controllers:[CartController],
    providers:[CartService],
})
export class CartModule {}
