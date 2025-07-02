import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls'; // Correct import for ClsService

@Injectable()
export class TenantContext {
  constructor(private readonly cls: ClsService) {}

  set tenantId(id: string) {
    this.cls.set('tenantId', id);
  }

  get tenantId(): string {
    const id = this.cls.get<string>('tenantId');
    if (!id) {
      // It's good practice to log or provide more context for unauthorized access
      console.warn('Attempted to access tenantId when not set in context.');
      throw new UnauthorizedException('Tenant ID not set in context.');
    }
    return id;
  }
}