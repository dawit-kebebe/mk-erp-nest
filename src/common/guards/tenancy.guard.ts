import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { TenantContext } from "../utils/tenant.context";

@Injectable()
export class TenancyGuard implements CanActivate {
    constructor(@Inject() private readonly tenantContext: TenantContext) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user = request?.user;

        if (!user?.tenantId) { 
            return false;
        }
        
       this.tenantContext.tenantId = user.tenantId; 

        return true; 
    }
}