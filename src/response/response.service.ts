import { BadRequestException, Injectable } from '@nestjs/common';
import Debug from 'debug'

const debug = Debug('debugging:debug')

@Injectable()
export class ResponseService {
    constructor(){}
    success(message:string,result:any,code:number= 200){
        debug(`response successfully status code ${code}`)
        return {
            statusCode:code,
            message,
            result
        }
    }
    failed(error:TypeError |string ){

            throw new BadRequestException(error).getResponse()
        
    }
}
