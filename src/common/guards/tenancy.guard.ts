import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class TenancyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user = request?.user;


        console.warn("Warning: " + user)
        // if (!user?.tenantId) {
        //     if (user.role === 'Super Admin') {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }

        return true;
    }
}