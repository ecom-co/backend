import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { Metadata } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';

import type { LoginDto, RegisterDto } from '@/modules/auth/dto';
import type { Observable } from 'rxjs';

export interface AuthResponseFromGrpc {
    accessToken: TokenResponse;
    refreshToken: TokenResponse;
    ssid: string;
    user: UserAuth;
}

export interface AuthServiceClient {
    GetProfile: (_: unknown, metadata?: Metadata) => Observable<{ message?: string; user: UserAuth }>;
    Login: (data: LoginDto, metadata?: Metadata) => Observable<AuthResponseFromGrpc>;
    RefreshToken: (_: unknown, metadata?: Metadata) => Observable<AuthResponseFromGrpc>;
    Register: (data: RegisterDto, metadata?: Metadata) => Observable<AuthResponseFromGrpc>;
}

export interface TokenResponse {
    metadata: {
        exp: number | string;
        iat: number | string;
        jti: string;
        ssid: string;
    };
    token: string;
}

export interface UserAuth {
    createdAt: string;
    email: string;
    firstName: string;
    fullName: string;
    id: string;
    isActive: boolean;
    lastName: string;
    updatedAt: string;
    username: string;
}

@Injectable()
export class AuthGrpcClient implements OnModuleInit {
    get service(): AuthServiceClient {
        return this.client;
    }

    private client!: AuthServiceClient;

    constructor(@Inject('AUTH_SERVICE') private readonly grpc: ClientGrpc) {}

    onModuleInit() {
        this.client = this.grpc.getService<AuthServiceClient>('AuthService');
    }
}
