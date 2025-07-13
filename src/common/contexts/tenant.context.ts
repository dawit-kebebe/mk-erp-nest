import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private _tenantId: string | null = null;

  set tenantId(id: string) {
    this._tenantId = id;
  }

  get tenantId(): string {
    const id = this._tenantId;
    if (!id) {
      // It's good practice to log or provide more context for unauthorized access
      console.warn('Attempted to access tenantId when not set in context.');
      throw new UnauthorizedException('Tenant ID not set in context.');
    }
    return id;
  }
}