import { Request, Response, NextFunction } from 'express';
import Debug from 'debug'

const debug = Debug('debugging:http')

export function logger(req: Request, res: Response, next: NextFunction) {
  debug(req.method+' '+req.url)
  next();
};