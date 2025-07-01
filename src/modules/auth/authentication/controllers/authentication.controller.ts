import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { RefreshAccessTokenResponseDto } from '../dto/refresh-access-token-response.dto';
import { RefreshAccessTokenRequestDto } from '../dto/refresh-access-token-request.dto';

@Controller()
export class AuthenticationController {
	constructor(private readonly authenticationService: AuthenticationService) { }

	@ApiOperation({ summary: 'Login and receive a JWT token' })
	@ApiResponse({
		status: 200,
		description: 'User successfully logged in, returns access token.',
		type: LoginResponseDto,
	})
	@ApiBody({
		type: LoginRequestDto,
		description: 'Login credentials',
	})
	@Post('/login')
	login(@Body() loginRequestDto: LoginRequestDto) {
		return this.authenticationService.login(loginRequestDto);
	}

	@ApiOperation({ summary: 'Refresh JWT token' })
	@ApiResponse({
		status: 200,
		description: 'The refreshed access token.',
		type: RefreshAccessTokenResponseDto,
	})
	@ApiBody({
		type: RefreshAccessTokenRequestDto,
		description: 'The refresh token used to obtain a new access token',
		required: true
	})
	@Post('/refresh-token')
	refreshToken(@Body() refreshAccessTokenRequestDto: RefreshAccessTokenRequestDto) {
		return this.authenticationService.refreshToken(refreshAccessTokenRequestDto);
	}

	@Post('/logout')
	logout() {
		return "Logged out";
	}

}
