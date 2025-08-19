import { Injectable } from '@nestjs/common';

interface GrpcCall {
    request?: {
        name?: string;
    };
}

interface GrpcCallback {
    (error: unknown, response: { message: string }): void;
}

@Injectable()
export class ExampleGrpcController {
    getHello(call: GrpcCall, callback: GrpcCallback) {
        const name = call.request?.name || 'World';

        callback(null, { message: `Hello ${name}` });
    }
}
