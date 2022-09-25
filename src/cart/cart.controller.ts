import { Body, Controller, Post, HttpStatus, HttpCode, Res, Get, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ResponseService } from 'src/response/response.service';
import { AddToCartDto } from './dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';
import { DeleteCartItemDto } from './dto/deleteCartItem.dto';

@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService,
        private response: ResponseService
    ) { }
    @HttpCode(HttpStatus.OK)
    @Get('')
    async getCart(
        @GetUser('userID') userID: string
    ){
        try {
            const cart = await this.cartService.getCart(userID)

            return this.response.success('ดึงสินค้าในตะกร้าแล้ว',cart)
        } catch (error) {
            return this.response.failed(error)
        }
    }


    @HttpCode(HttpStatus.OK)
    @Post('addToCart')
    async addToCart(
        @Body() addToCartDto: AddToCartDto,
        @GetUser('userID') userID: string
    ) {
        try {
            const cart = await this.cartService.addToCart({...addToCartDto,userID})
            return this.response.success('เพิ่มสินค้าลงรถเข็นสำเร็จ',cart)
        } catch (error) {
            return this.response.failed(error)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('decreaseCart')
    async decreaseCart(
        @Body() addToCartDto: AddToCartDto,
        @GetUser('userID') userID: string
    ) {
        try {
            const cart = await this.cartService.decreaseCart({...addToCartDto,userID})
            return this.response.success('ลบสินค้าลงรถเข็นสำเร็จ',cart)
        } catch (error) {
            return this.response.failed(error)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('deleteCartItem')
    async deleteCartItem(
        @Body() deleteCartItemDto:DeleteCartItemDto,
        @GetUser('userID') userID: string
    ) {
        try {
            const cart = await this.cartService.deleteCartItem({...deleteCartItemDto,userID})
            return this.response.success('ลบสินค้าลงรถเข็นสำเร็จ',cart)
        } catch (error) {
            return this.response.failed(error)
        }
    }
}
