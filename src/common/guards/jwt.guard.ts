import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Observable } from "rxjs";

@Injectable()
@ApiBearerAuth()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new UnauthorizedException('Token missing from Authorization header');
    }

    try {
        const decoded: any = this.jwtService.verify(token, {
            secret: this.configService.get<string>('JWT_SECRET')
        });

        request.user = {
           username: decoded.username,
           userId: decoded.sub,
           roleId: decoded.roleId,
           organizationalUnitId: decoded.organizationalUnitId,
           tenantId: decoded.tenantId,
        };

        return true;
    } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
    }
  }
}