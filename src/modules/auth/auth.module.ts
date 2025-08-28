import { join } from 'path';

import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from '@/modules/auth/auth.controller';
import { AuthGrpcClient } from '@/modules/auth/auth.grpc.client';
import { AuthService } from '@/modules/auth/auth.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
                options: {
                    package: 'auth',
                    protoPath: join(process.cwd(), 'src/proto/services/auth.proto'),
                    url: 'localhost:50052',
                },
                transport: Transport.GRPC,
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthGrpcClient, AuthService],
})
export class AuthModule {}
