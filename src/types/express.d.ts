import { JwtPayload } from './auth';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}