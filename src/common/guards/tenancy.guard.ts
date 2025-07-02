import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Observable } from "rxjs";
import { TenantContext } from "../utils/tenant.context";

export class TenancyGuard implements CanActivate {
    constructor(@Inject(TenantContext) private readonly tenantContext: TenantContext) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user = request?.user;

        if (!user?.tenantId) { 
            return false;
        }
        
        this.tenantContext.tenantId = user.tenantId; 

        console.error(this.tenantContext)

        return true; 
    }
}