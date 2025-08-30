import { Global, Module } from '@nestjs/common';

import { PROTO_PATHS } from '@ecom-co/grpc';
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
                        protoPath: PROTO_PATHS.SERVICES.AUTH,
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
