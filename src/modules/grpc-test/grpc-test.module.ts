import { join } from 'path';

import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';

import { GrpcTestController } from './grpc-test.controller';
import { GrpcTestService } from './grpc-test.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'USER_SERVICE',
                options: {
                    package: 'user',
                    protoPath: join(process.cwd(), 'src/proto/services/user.proto'),
                    url: 'localhost:50052',
                },
                transport: Transport.GRPC,
            },
        ]),
    ],
    controllers: [GrpcTestController],
    providers: [GrpcTestService],
})
export class GrpcTestModule {}
