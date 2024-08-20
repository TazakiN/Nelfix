import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest() as Request;
    const token = localStorage.getItem('token');

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return next.handle();
  }
}
