import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserContext } from "../contexts/user.context";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(@Inject() private readonly userContext: UserContext) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user = request?.user;

        if (!user?.sub) { 
            throw new ForbiddenException("Could not set user context.")
        }
        
       this.userContext.userId = user.sub; 

        return true; 
    }
}