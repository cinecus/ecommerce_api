import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ResponseService } from 'src/response/response.service';
import { AddStockDto } from './dto/addStock.dto';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
    constructor(
        private stockService :StockService,
        private response: ResponseService
    ){}

    @HttpCode(HttpStatus.CREATED)
    @Post('addStock')
    async addStock(@Body() addStockDto:AddStockDto){
        try {
            const addedStock = await this.stockService.addStockProduct(addStockDto)
            return this.response.success('แก้ไขจำนวนสต็อคสำเร็จ', addedStock)
        } catch (error) {
            return this.response.failed(error)
        }
    }
}
