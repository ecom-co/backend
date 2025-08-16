import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleGrpcController {
    getHello(call: any, callback: any) {
        const name = call.request?.name || 'World';
        callback(null, { message: `Hello ${name}` });
    }
}
