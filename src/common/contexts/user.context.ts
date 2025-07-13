import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UserContext {
  private _userId: string | null = null;

  set userId(id: string) {
    this._userId = id;
  }

  get userId(): string {
    const id = this._userId;
    if (!id) {
      // It's good practice to log or provide more context for unauthorized access
      console.warn('Attempted to access userId when not set in context.');
      throw new UnauthorizedException('User ID not set in context.');
    }
    return id;
  }
}