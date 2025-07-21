import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { CACHE_ENTITY_KEY } from '../decorators/cache-entity-key.decorator';

@Injectable()
export class InvalidateCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    const shouldInvalidate = ['POST', 'PUT', 'DELETE'].includes(method);

    if (!shouldInvalidate) {
      return next.handle();
    }

    // Get the controller class
    const targetClass = context.getClass();
    const cacheKey = this.reflector.get<string>(CACHE_ENTITY_KEY, targetClass);
    if (!cacheKey) {
      return next.handle(); // nothing to invalidate
    }

    return next.handle().pipe(
      tap(async () => {
        console.log(await this.cacheManager.get(cacheKey));
        await this.cacheManager.del(cacheKey);
      })
    );
  }
}
