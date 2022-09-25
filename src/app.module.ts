import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ResponseService } from './response/response.service';
import { ResponseModule } from './response/response.module';
import { JwtStrategy } from './auth/strategy';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { StockModule } from './stock/stock.module';
import { SendgridService } from './sendgrid/sendgrid.service';
import { SendgridModule } from './sendgrid/sendgrid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'), // Loaded from .ENV
      })
    }),
    AuthModule,
    ResponseModule,
    ProductModule,
    CartModule,
    StockModule,
    SendgridModule
  ],
  controllers: [AppController],
  providers: [AppService, ResponseService, SendgridService],
})
export class AppModule { }
