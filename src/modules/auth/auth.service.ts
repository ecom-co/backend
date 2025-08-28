import { Injectable, Logger } from '@nestjs/common';

import { Metadata } from '@grpc/grpc-js';
import { map, Observable } from 'rxjs';

import { AuthGrpcClient, AuthServiceClient, UserAuth } from '@/modules/auth/auth.grpc.client';
import { LoginDto, RegisterDto } from '@/modules/auth/dto';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    ssid: string;
    user: UserAuth;
}

@Injectable()
export class AuthService {
    private authService: AuthServiceClient;
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly authGrpcClient: AuthGrpcClient) {}

    onModuleInit() {
        this.authService = this.authGrpcClient.service;
    }

    getProfile(metadata?: Metadata): Observable<UserAuth> {
        return this.authService.GetProfile({}, metadata).pipe(map((response) => response.user));
    }

    login(loginDto: LoginDto): Observable<AuthResponse> {
        return this.authService.Login(loginDto).pipe(
            map((response) => ({
                accessToken: response.accessToken.token,
                refreshToken: response.refreshToken.token,
                ssid: response.ssid,
                user: response.user,
            })),
        );
    }

    refreshToken(metadata?: Metadata): Observable<AuthResponse> {
        return this.authService.RefreshToken({}, metadata).pipe(
            map((response) => ({
                accessToken: response.accessToken.token,
                refreshToken: response.refreshToken.token,
                ssid: response.ssid,
                user: response.user,
            })),
        );
    }

    register(registerDto: RegisterDto): Observable<AuthResponse> {
        return this.authService.Register(registerDto).pipe(
            map((response) => ({
                accessToken: response.accessToken.token,
                refreshToken: response.refreshToken.token,
                ssid: response.ssid,
                user: response.user,
            })),
        );
    }
}
