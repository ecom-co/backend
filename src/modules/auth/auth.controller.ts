import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';

import { ApiEndpoint, ApiResponseData, ApiTags, AUTH_TYPE } from '@ecom-co/utils';
import { Metadata } from '@grpc/grpc-js';
import { Request, Response } from 'express';
import { map, Observable, tap } from 'rxjs';

import { AuthService } from '@/modules/auth/auth.service';
import { LoginDto, LoginResponseDto, RegisterDto, UserAuthDto } from '@/modules/auth/dto';

/**
 * Use DTO instead of interface for consistent API schema and serialization
 */

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiEndpoint({
        apiUrl: '@GET api/v1/auth/profile',
        auth: [{ type: AUTH_TYPE.JWT, provider: 'access-token', required: false }],
        description: 'Get the profile of the current user.',
        errors: [HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR],
        responses: {
            [HttpStatus.OK]: {
                type: UserAuthDto,
                description: 'Profile retrieved successfully',
            },
        },
        summary: 'Get the profile of the current user.',
    })
    @Get('profile')
    getProfile(@Req() request: Request): Observable<ApiResponseData<UserAuthDto>> {
        const metadata = new Metadata();

        metadata.add('authorization', request.headers['authorization']);

        return this.authService
            .getProfile(metadata)
            .pipe(map((user) => new ApiResponseData({ data: new UserAuthDto(user) })));
    }

    @ApiEndpoint({
        apiUrl: '@POST api/v1/auth/login',
        auth: [{ type: AUTH_TYPE.JWT, provider: 'access-token', required: false }],
        description: 'Login the user.',
        errors: [HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR],
        responses: {
            [HttpStatus.OK]: {
                type: LoginResponseDto,
                description: 'Login successful',
            },
        },
        summary: 'Login the user.',
    })
    @Post('login')
    login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ): Observable<ApiResponseData<LoginResponseDto>> {
        return this.authService.login(loginDto).pipe(
            tap((authResponse) => {
                response.cookie('refresh-token', authResponse.refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                });
            }),
            map(
                (authResponse) =>
                    new ApiResponseData({
                        data: new LoginResponseDto({
                            accessToken: authResponse.accessToken,
                            user: new UserAuthDto(authResponse.user),
                        }),
                    }),
            ),
        );
    }

    @ApiEndpoint({
        apiUrl: '@POST api/v1/auth/refresh-token',
        auth: [{ name: 'refresh-token', type: AUTH_TYPE.COOKIE, required: true }],
        description: 'Refresh the access token.',
        errors: [HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR],
        responses: {
            [HttpStatus.OK]: {
                type: LoginResponseDto,
                description: 'Refresh token successful',
            },
        },
        summary: 'Refresh the access token.',
    })
    @Post('refresh-token')
    refreshToken(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Observable<ApiResponseData<LoginResponseDto>> {
        const metadata = new Metadata();

        metadata.add('authorization', request.cookies['refresh-token'] as string);

        return this.authService.refreshToken(metadata).pipe(
            tap((authResponse) => {
                response.cookie('refresh-token', authResponse.refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                });
            }),
            map(
                (authResponse) =>
                    new ApiResponseData({
                        data: new LoginResponseDto({
                            accessToken: authResponse.accessToken,
                            user: new UserAuthDto(authResponse.user),
                        }),
                    }),
            ),
        );
    }

    @ApiEndpoint({
        apiUrl: '@POST api/v1/auth/register',
        description: 'Register the user.',
        errors: [HttpStatus.UNAUTHORIZED, HttpStatus.BAD_REQUEST, HttpStatus.CONFLICT],
        responses: {
            [HttpStatus.OK]: {
                type: LoginResponseDto,
                description: 'Register successful',
            },
        },
        summary: 'Register the user.',
    })
    @Post('register')
    register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) response: Response,
    ): Observable<ApiResponseData<LoginResponseDto>> {
        return this.authService.register(registerDto).pipe(
            tap((authResponse) => {
                response.cookie('refresh-token', authResponse.refreshToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                });
            }),
            map(
                (authResponse) =>
                    new ApiResponseData({
                        data: new LoginResponseDto({
                            accessToken: authResponse.accessToken,
                            user: new UserAuthDto(authResponse.user),
                        }),
                    }),
            ),
        );
    }
}
