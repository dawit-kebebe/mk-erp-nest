import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { OrganizationalUnitContext } from "../contexts/organizational-unit.context";

@Injectable()
export class OrganizationalUnitGuard implements CanActivate {
    constructor(@Inject() private readonly organizationalUnitContext: OrganizationalUnitContext) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user = request?.user;

        if (!user?.organizationalUnitId) { 
            throw new ForbiddenException("Could not set organizational unit context");
        }
        
       this.organizationalUnitContext.organizationalUnitId = user.organizationalUnitId; 

        return true; 
    }
}