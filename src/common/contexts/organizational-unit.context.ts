import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class OrganizationalUnitContext {
  private _organizationalUnitId: string | null = null;

  set organizationalUnitId(id: string) {
    this._organizationalUnitId = id;
  }

  get organizationalUnitId(): string {
    const id = this._organizationalUnitId;
    if (!id) {
      // It's good practice to log or provide more context for unauthorized access
      console.warn('Attempted to access organizationalUnitId when not set in context.');
      throw new UnauthorizedException('Organizational Unit ID not set in context.');
    }
    return id;
  }
}