import { Module } from '@nestjs/common';
import { TenantContext } from '@mk/common/utils/tenant.context';
import { AccessLevelContext } from '@mk/common/utils/access-level.context';
@Module({
    providers: [TenantContext, AccessLevelContext],
    exports: [TenantContext, AccessLevelContext],
})
export class ContextModule { }
