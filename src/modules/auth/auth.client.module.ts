import { join } from 'path';

import { Global, Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthGrpcClient } from '@/modules/auth/auth.grpc.client';
import { ConfigModule } from '@/modules/config/config.module';
import { ConfigServiceApp } from '@/modules/config/config.service';

@Global()
@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigServiceApp],
                useFactory: (config: ConfigServiceApp) => ({
                    options: {
                        package: 'auth',
                        protoPath: join(process.cwd(), 'src/proto/services/auth.proto'),
                        url: config.authGrpcUrl ?? 'localhost:50052',
                    },
                    transport: Transport.GRPC,
                }),
            },
        ]),
    ],
    providers: [AuthGrpcClient],
    exports: [AuthGrpcClient],
})
export class AuthClientModule {}
