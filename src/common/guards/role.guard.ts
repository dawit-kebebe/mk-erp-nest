import { Role } from "@mk/database/entities/role.entity";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { REQUIRED_PERMISSIONS_KEY } from "../decorators/RequiredPermission";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
        @Inject() private readonly reflector: Reflector,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async canActivate(context: ExecutionContext) {///: boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        const user = request?.user;

        if (!user?.roleId) {
            return false;
        }

        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            REQUIRED_PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()], // Look on the method first, then the class
        );

        const method = request.method;
        const role = await this.cacheManager.get<Role>(`role:${user.roleId}`);

        if (!role) {
            return false;
        }

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        return requiredPermissions.some((permission) => {
            const currentPermission = role.permissions.find((perm) => perm.featureTag === permission);
            if (!currentPermission) {
                return false;
            }

            if (method === 'GET' && currentPermission.view) {
                return true;
            }

            if (method === 'POST' && currentPermission.add) {
                return true;
            }

            if (method === 'PUT' && currentPermission.update) {
                return true;
            }

            if (method === 'DELETE' && currentPermission.delete) {
                return true
            }

            return false;
        })
    }
}