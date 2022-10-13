import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Debug from 'debug'
import { AppRequest } from 'src/types';

const debug = Debug('debugging:debug')

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    debug(`access token: ${request.cookies.accessToken}`)
    return request.user.userID
  },
)