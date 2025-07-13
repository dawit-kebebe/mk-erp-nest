import { AccessLevelContext } from '@mk/common/contexts/access-level.context';
import { TenantContext } from '@mk/common/contexts/tenant.context';
import { Module } from '@nestjs/common';
import { ApprovalContext } from '../contexts/approval.context';
import { OrganizationalUnitContext } from '../contexts/organizational-unit.context';
import { UserContext } from '../contexts/user.context';
@Module({
    providers: [TenantContext, AccessLevelContext, OrganizationalUnitContext, UserContext, ApprovalContext],
    exports: [TenantContext, AccessLevelContext, OrganizationalUnitContext, UserContext, ApprovalContext],
})
export class ContextModule { }
