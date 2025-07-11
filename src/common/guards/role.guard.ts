import { OrganizationalUnit } from "@mk/database/entities/organizational-unit.entity";
import { Role } from "@mk/database/entities/role.entity";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { REQUIRED_PERMISSIONS_KEY } from "../decorators/RequiredPermission";
import { ACCESS_LEVEL } from "../enum/access-level.enum";
import { AccessLevelContext } from "../utils/access-level.context";
import { buildTree, getSubTree, TreeNode } from "../utils/organizational-unit-tree-builder";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(OrganizationalUnit) private readonly organizationalUnitRepo: Repository<OrganizationalUnit>,
        @Inject() private readonly accessLevelContext: AccessLevelContext,
        @Inject() private readonly reflector: Reflector,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request?.user;
        
        if (!user?.roleId || !user.organizationalUnitId) {
            return false;
        }
        
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            REQUIRED_PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()], // Look on the method first, then the class
        );

        const method = request.method;
        let role = await this.cacheManager.get<Role>(`role:${user.roleId}`);

        if (!role) {
            const loadedRole = await this.roleRepo.findOne({ where: { id: user.roleId } })
            if (!loadedRole) {
                return false;
            }
            await this.cacheManager.set(`role:${user.roleId}`, loadedRole);
            role = loadedRole;
        }

        let cachedOrgTree = await this.cacheManager.get<Map<string, TreeNode<OrganizationalUnit>>>(`org-tree:${user.organizationalUnitId}`);
        if (!cachedOrgTree) {
            const fullOrg = await this.organizationalUnitRepo.find();
            if (!fullOrg || fullOrg.length === 0) {
                return false;
            }
            const orgTree = buildTree(fullOrg);
            await this.cacheManager.set(`org-tree:${user.organizationalUnitId}`, orgTree);
            cachedOrgTree = await this.cacheManager.get(`org-tree:${user.organizationalUnitId}`);
            if (!cachedOrgTree) {
                return false;
            }
        }

        const orgArray: OrganizationalUnit[] = [];
        const seenIds = new Set<string>();

        cachedOrgTree.forEach((treeNode) => {
            if (!seenIds.has(treeNode.id)) {
                orgArray.push(treeNode);
                seenIds.add(treeNode.id);
            }
        });

        const currentUserOrg = getSubTree(user.organizationalUnitId, cachedOrgTree);
        if (!currentUserOrg)
            return false;

        if (orgArray.length === 0) {
            return false;
        }

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        let permissionError;
        let permitted = true;
        for (const permission of requiredPermissions) {
            const currentPermission = role.permissions.find((perm) => perm.featureTag === permission);
            if (!currentPermission) {
                permitted = false;
                permissionError = `Missing permission for feature ${permission}.`;
                break;
            }

            switch (currentPermission.accessLevel.accessLevelTag) {
                case ACCESS_LEVEL.CHILDREN:
                    this.accessLevelContext.pushAccessLevelContext({
                        accessLevelTag: ACCESS_LEVEL.CHILDREN,
                        organizationalUnitId: [...currentUserOrg.children, currentUserOrg]
                    });
                    break;
                case ACCESS_LEVEL.MULTI_UNIT:
                    if (!currentPermission.accessLevel.organizationalUnits || !Array.isArray(currentPermission.accessLevel.organizationalUnits) || currentPermission.accessLevel.organizationalUnits.length === 0) {
                        permitted = false;
                        permissionError = `No organizational units defined for MULTI_UNIT access level.`;
                        break;
                    }
                    this.accessLevelContext.pushAccessLevelContext({
                        accessLevelTag: ACCESS_LEVEL.MULTI_UNIT,
                        organizationalUnitId: currentPermission.accessLevel.organizationalUnits
                    });
                    break;
                case ACCESS_LEVEL.SELF_UNIT:
                    this.accessLevelContext.pushAccessLevelContext({
                        accessLevelTag: ACCESS_LEVEL.SELF_UNIT,
                        organizationalUnitId: [currentUserOrg]
                    });
                    break;
                case ACCESS_LEVEL.GLOBAL:
                    this.accessLevelContext.pushAccessLevelContext({
                        accessLevelTag: ACCESS_LEVEL.GLOBAL,
                        organizationalUnitId: orgArray
                    });
                    break;
                case ACCESS_LEVEL.ROOT:
                    const rootOrg = cachedOrgTree.get(currentUserOrg.tenantId);
                    if (!rootOrg) {
                        permitted = false;
                        permissionError = `Root org not found for tenant ${currentUserOrg.tenantId}.`;
                        break;
                    }
                    this.accessLevelContext.pushAccessLevelContext({
                        accessLevelTag: ACCESS_LEVEL.ROOT,
                        organizationalUnitId: rootOrg.children
                    });
                    break;
                default:
                    permitted = false;
                    permissionError = `Unknown access level: ${currentPermission.accessLevel.accessLevelTag}`;
                    break;
            }
            if (!permitted) break;

            if (method === 'GET' && currentPermission.view) {
                continue;
            }
            if (method === 'POST' && currentPermission.add) {
                continue;
            }
            if (method === 'PUT' && currentPermission.update) {
                continue;
            }
            if (method === 'DELETE' && currentPermission.delete) {
                continue;
            }
            permitted = false;
            permissionError = `${method} is not allowed for feature ${currentPermission.featureTag}.`;
            break;
        }

        if (!permitted) {
            throw new ForbiddenException(permissionError);
        }

        return permitted;
    }
}