import { Permission } from '@mk/database/entities/permission.entity';
import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ApprovalContext {
  private _approvalPermissionOn: Permission[] | null = null;

  set accessLevelContext(approvalPermissionOn: Permission[]) {
    this._approvalPermissionOn = [...approvalPermissionOn];
  }

  pushApprovalContext(approvalPermission: Permission) {
    if (!this._approvalPermissionOn) {
      this._approvalPermissionOn = [];
    }
    
    this._approvalPermissionOn.push(approvalPermission);
  }


  get accessLevelContext(): Permission[] {
    if (!this._approvalPermissionOn || this._approvalPermissionOn.length === 0) {
      console.warn('Attempted to access \'aproval permissions\' when not set in context.');
      throw new UnauthorizedException('Approval Permissions not set in context.');
    }
    return this._approvalPermissionOn;
  }
}
