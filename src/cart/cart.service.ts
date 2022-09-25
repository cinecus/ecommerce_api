import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Auth, AuthDocument } from 'src/auth/schema/auth.schema';
import { Stock, StockDocument } from 'src/stock/schema/stock.schema';
import { AddToCartDto } from './dto';
import { DeleteCartItemDto } from './dto/deleteCartItem.dto';
import { Cart, CartDocument } from './schema/cart.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
        @InjectModel(Stock.name) private readonly stockModel: Model<StockDocument>,
        @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>
    ) { }

    async getCart(userID: string) {
        try {
            const { cart } = await this.authModel.findById(new mongoose.Types.ObjectId(userID))
                .populate({
                    path: 'cart',
                    populate: { path: "productID" },
                    options: {
                        sort: { createDate: -1 }
                    }
                })
            return cart
        } catch (error) {
            console.log('error', error)
            throw new Error
        }
    }

    async addToCart(addToCartDto: AddToCartDto & { userID: string }) {
        const { productID, userID } = addToCartDto
        let { qty } = addToCartDto
        try {
            //ค้นหา stock สินค้า productID นั้น
            const stock = await this.stockModel.findOne({
                productID: new mongoose.Types.ObjectId(productID)
            })

            if (stock.available <= 0) {
                return Promise.reject('จำนวนสต็อคไม่เพียงพอ')
            }

            //ค้นหาว่า productID และ userID ที่ส่งมาเคยเพิ่มมาแล้วหรือไม่?
            const findCart = await this.cartModel.findOne({
                productID,
                userID
            })

            qty = stock.available < qty ? stock.available : qty

            // กรณี จำนวน stock ที่เหลือน้อยกว่า qty ให้เพิ่มเท่าที่ stock เหลือ

            //ลดจำนวน stock
            stock.available -= qty
            stock.save()

            //ถ้าเจอ qty จะ update //ถ้าไม่เจอจะสร้าง record นั้น
            if (findCart) {
                findCart.qty += qty
                findCart.save()
                return findCart
            } else {
                const createdCart = await this.cartModel.create({ productID, userID, qty })
                const user = await this.authModel.findById(new mongoose.Types.ObjectId(userID))
                user.cart.push(createdCart.id)
                user.save()
                return createdCart
            }

        } catch (error) {
            console.log('error', error)
            throw new Error
        }
    }

    async decreaseCart(addToCartDto: AddToCartDto & { userID: string }) {
        const { productID, userID } = addToCartDto
        let { qty } = addToCartDto
        try {
            //ค้นหา stock สินค้า productID นั้น
            const stock = await this.stockModel.findOne({
                productID: new mongoose.Types.ObjectId(productID)
            })

            //ค้นหาว่า productID และ userID ที่ส่งมาเคยเพิ่มมาแล้วหรือไม่?
            const findCart = await this.cartModel.findOne({
                productID,
                userID
            })

            //เพิ่มจำนวน stock
            stock.available += qty
            stock.save()

            //ถ้าเจอ qty ในตะกร้า <= 0 แล้ว จะลบ record นั้นทิ้ง
            findCart.qty -= qty
            findCart.save()
            if (findCart.qty <= 0) {
                const deletedCart = await this.cartModel.deleteOne({
                    productID,
                    userID
                })
                let user = await this.authModel.findById(new mongoose.Types.ObjectId(userID))
                user.cart = user.cart.filter(el => el != findCart.id) as [Cart]
                user.save()
                return deletedCart
            } else {
                return findCart
            }

        } catch (error) {
            throw new Error
        }
    }

    async deleteCartItem(deleteCartItemDto: DeleteCartItemDto & { userID: string }) {
        const { cartID, userID } = deleteCartItemDto
        try {
            const deletedCart = await this.cartModel.findByIdAndDelete(new mongoose.Types.ObjectId(cartID))
            const stock = await this.stockModel.findOne({
                productID: deletedCart.productID
            })
            //เพิ่มจำนวน stock
            stock.available += deletedCart.qty
            stock.save()
            const user = await this.authModel.findById(new mongoose.Types.ObjectId(userID))
            user.cart = user.cart.filter(el => el != deletedCart.id) as [Cart]
            await user.save()
            return deletedCart
        } catch (error) {
            throw new Error
        }

    }
}
