import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ACCESS_LEVEL } from '../enum/access-level.enum';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { FEATURES } from '../enum/feature.enum';

interface IAccessLevelContext {
  featureTag: FEATURES;
  accessLevelTag: ACCESS_LEVEL;
  organizationalUnitId: OrganizationalUnit[];
}

@Injectable({ scope: Scope.REQUEST })
export class AccessLevelContext {
  private _accessLevelContext: IAccessLevelContext[] | null = null;

  set accessLevelContext(accessLevelContext: IAccessLevelContext[]) {
    this._accessLevelContext = [...accessLevelContext];
  }

  pushAccessLevelContext(accessLevel: IAccessLevelContext) {
    if (!this._accessLevelContext) {
      this._accessLevelContext = [];
    }
    
    this._accessLevelContext.push(accessLevel);
  }

  get accessLevelContext(): IAccessLevelContext[] {
    if (!this._accessLevelContext || this._accessLevelContext.length === 0) {
      console.warn('Attempted to access \'access level\' when not set in context.');
      throw new UnauthorizedException('Access Level not set in context.');
    }
    return this._accessLevelContext;
  }
}
