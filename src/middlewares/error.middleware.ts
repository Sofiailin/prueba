import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Algo salió mal en el servidor';

  console.error(`[Error] ${message}`);
  res.status(status).json({
    status,
    message,
    details: err.details || null
  });
};