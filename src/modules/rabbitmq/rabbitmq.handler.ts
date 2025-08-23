import { Injectable, Logger } from '@nestjs/common';

import { RabbitRPC, RabbitSubscribe } from '@ecom-co/rabbitmq';

interface RabbitMessage {
    from: string;
    type: string;
}

interface RawMessage {
    properties?: Record<string, unknown>;
}

interface SubscriptionMessage {
    [key: string]: unknown;
}

@Injectable()
export class OrdersRabbitHandler {
    private readonly logger = new Logger(OrdersRabbitHandler.name);

    @RabbitRPC({
        exchange: 'demo.exchange2',
        queue: 'rpc.demo.exchange2.rpc.routing.key',
        routingKey: 'rpc.routing.key',
    })
    public handleRpcRequest(msg: RabbitMessage, rawMessage?: RawMessage) {
        this.logger.log(`🔥 [DEMO RPC] Received message: ${JSON.stringify(msg)}`);
        this.logger.log(`🔥 [DEMO RPC] Raw message properties: ${JSON.stringify(rawMessage?.properties)}`);
        this.logger.log('🔥 [DEMO RPC] Processing request...');

        const response = {
            echo: msg,
            ok: true,
            timestamp: new Date().toISOString(),
        };

        this.logger.log(`🔥 [DEMO RPC] Sending response: ${JSON.stringify(response)}`);

        return response;
    }

    @RabbitSubscribe({
        exchange: 'demo.exchange2',
        queue: 'subscribe.queue',
        routingKey: 'subscribe.routing.key',
    })
    public handleSubscription(msg: SubscriptionMessage) {
        this.logger.log(`Received subscription message: ${JSON.stringify(msg)}`);
    }
}
