import { Body, Controller, Post, HttpStatus, HttpCode, Res, Get, UseGuards } from '@nestjs/common';
import { ResponseService } from 'src/response/response.service';
import { CreateProductDto } from './dto';
import { ProductService } from './product.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard';


@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService,
        private response: ResponseService
    ) {

    }

    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    async createProduct(@Body() createProductDto: CreateProductDto) {
        try {
            const product = await this.productService.createProduct(createProductDto)
            return this.response.success('สร้างสินค้าสำเร็จ', product)
        } catch (error) {
            return this.response.failed(error)
        }
    }

    @Get()
    async getAllProduct() {
        try {
            const product = await this.productService.getAllProduct()
            return this.response.success('ดึงข้อมูลสินค้าสำเร็จ', product)
        } catch (error) {
            return this.response.failed(error)
        }

    }
}
