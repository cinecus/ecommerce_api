import { AuthGuard } from "@nestjs/passport";

export class LineGuard extends AuthGuard('line'){
    constructor(){
        super()
    }
}