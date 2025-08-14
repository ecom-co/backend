import { AmqpConnection } from '@ecom-co/rabbitmq';
import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';

import { RabbitmqService } from './rabbitmq.service';

@Controller('rabbitmq')
export class RabbitmqController {
    private readonly logger = new Logger(RabbitmqController.name);
    constructor(
        private readonly amqp: AmqpConnection,
        private readonly rabbitService: RabbitmqService,
    ) {}

    @Post('publish')
    async publish(@Body() body: any) {
        await this.amqp.publish('demo.exchange2', 'subscribe.routing.key', {
            source: 'http',
            type: 'publish-demo',
            payload: body ?? { hello: 'world' },
        });
        return { ok: true };
    }

    @Get('rpc')
    async rpc() {
        this.logger.log('🚀 Sending RPC request to demo.exchange2 (after restart)...');
        try {
            const result = await this.amqp.request<{ ok: boolean; echo: any; timestamp: string }>({
                exchange: 'demo.exchange2',
                routingKey: 'rpc.routing.key',
                payload: { from: 'http', type: 'rpc-demo' },
                timeout: 5000,
            });
            this.logger.log(`✅ RPC response received: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            this.logger.error(
                `❌ RPC request failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
            );
            throw error;
        }
    }

    @Get('rpc2')
    async rpc2() {
        this.logger.log('🚀 Sending RPC request to demo.exchange2...');
        try {
            const result = await this.amqp.request<{ ok: boolean; echo: any; timestamp: string }>({
                exchange: 'demo.exchange2',
                routingKey: 'rpc.routing.key',
                payload: { from: 'http', type: 'rpc-demo' },
                timeout: 3000,
            });
            this.logger.log(`✅ RPC response received: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            this.logger.error(
                `❌ RPC request failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
            );
            throw error;
        }
    }

    @Get('test-simple')
    async testSimple() {
        this.logger.log('🧪 Testing simple publish (no RPC)...');
        try {
            // Test simple publish
            await this.amqp.publish('demo.exchange2', 'subscribe.routing.key', {
                source: 'test',
                type: 'simple-test',
                payload: { message: 'Hello from simple test!' },
            });

            return {
                message: 'Message published successfully',
                exchange: 'demo.exchange2',
                routingKey: 'subscribe.routing.key',
                timestamp: new Date().toISOString(),
            };
        } catch (error) {
            this.logger.error(
                `❌ Simple publish failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
            );
            throw error;
        }
    }

    @Get('sum')
    async sum(@Query('a') a: string, @Query('b') b: string) {
        const aNum = Number(a);
        const bNum = Number(b);
        if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
            return { ok: false, message: 'Query params a and b must be numbers' };
        }
        const res = await this.rabbitService.sum(aNum, bNum);
        return { ok: true, ...res };
    }
}
