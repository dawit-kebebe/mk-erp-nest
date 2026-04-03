import { Role } from '@mk/database/entities/role.entity';
import { User } from '@mk/database/entities/user.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RefreshAccessTokenRequestDto } from '../dto/refresh-access-token-request.dto';
import { RefreshAccessTokenResponseDto } from '../dto/refresh-access-token-response.dto';

@Injectable()
export class AuthenticationService {

	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@Inject() private readonly jwtService: JwtService,
		@Inject() private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) { }

	async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
		const user = await this.userRepository.findOne({ where: { email }, relations: ['role', 'role.permissions', 'role.permissions.accessLevel'] });

		if (user && (await bcrypt.compare(password, user.password))) {
			// Exclude password in a type-safe way
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...userWithoutPassword } = user;

			return userWithoutPassword as Omit<User, 'password'>;
		}
		return null;
	}

	refreshToken(refreshTokenRequestDto: RefreshAccessTokenRequestDto): RefreshAccessTokenResponseDto {

		const payload = this.jwtService.verify(refreshTokenRequestDto.refresh_token);

		if (!payload || typeof payload !== 'object') {
			throw new UnauthorizedException('Invalid refresh token payload');
		}

		// Optionally, check if the token is expired or blacklisted here
		if (!('exp' in payload) || typeof payload.exp !== 'number' || payload.exp <= Date.now() / 1000) {
			throw new UnauthorizedException('Refresh token has expired or is invalid');
		}

		const { username, sub, roleId, organizationalUnitId, tenantId } = payload;

		if (!username || !sub || !organizationalUnitId || !tenantId || typeof roleId === 'undefined') {
			throw new UnauthorizedException('Refresh token payload missing required properties');
		}

		const newAccessToken = this.jwtService.sign({ username, sub, roleId, organizationalUnitId, tenantId });
		return { access_token: newAccessToken };

	}

	async login(loginDto: LoginRequestDto,): Promise<LoginResponseDto> {
		const user = await this.validateUser(loginDto.email, loginDto.password);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = {
			username: user.username,
			sub: user.id,
			roleId: user.roleId,
			organizationalUnitId: user.organizationalUnitId,
			tenantId: user.tenantId,
		};

		if (payload.roleId) {
			const role = user.role;
			if (!role)
				throw new UnauthorizedException('Invalid role ID');

			// Cache with proper namespace
			await this.cacheManager.set(`role:${payload.roleId}`, role);
		}

		Logger.log(`[MK-ERP] - User logged in successfully: ${JSON.stringify(payload)} `)

		return {
			access_token: this.jwtService.sign(payload),
			refresh_token: this.jwtService.sign(payload, { expiresIn: this.configService.get<any>("JWT_REFRESH_EXPIRATION_TIME"), secret: this.configService.get<string>("JWT_REFRESH_SECRET") })
		};
	}

	logout() { }
}
