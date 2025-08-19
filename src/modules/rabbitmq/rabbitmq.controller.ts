import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';

import { AmqpConnection } from '@ecom-co/rabbitmq';

import { RabbitmqService } from '@/modules/rabbitmq/rabbitmq.service';

@Controller('rabbitmq')
export class RabbitmqController {
    private readonly logger = new Logger(RabbitmqController.name);
    constructor(
        private readonly amqp: AmqpConnection,
        private readonly rabbitService: RabbitmqService,
    ) {}

    @Post('publish')
    async publish(@Body() body: { hello: string }) {
        await this.amqp.publish('demo.exchange2', 'subscribe.routing.key', {
            payload: body ?? { hello: 'world' },
            source: 'http',
            type: 'publish-demo',
        });

        return { ok: true };
    }

    @Get('rpc')
    async rpc() {
        this.logger.log('🚀 Sending RPC request to demo.exchange2 (after restart)...');

        try {
            const result = await this.amqp.request<{ echo: unknown; ok: boolean; timestamp: string }>({
                exchange: 'demo.exchange2',
                payload: { from: 'http', type: 'rpc-demo' },
                routingKey: 'rpc.routing.key',
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
            const result = await this.amqp.request<{ echo: unknown; ok: boolean; timestamp: string }>({
                exchange: 'demo.exchange2',
                payload: { from: 'http', type: 'rpc-demo' },
                routingKey: 'rpc.routing.key',
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

    @Get('sum')
    async sum(@Query('a') a: string, @Query('b') b: string) {
        const aNum = Number(a);
        const bNum = Number(b);

        if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
            return { message: 'Query params a and b must be numbers', ok: false };
        }

        const res = await this.rabbitService.sum(aNum, bNum);

        return { ok: true, ...res };
    }

    @Get('test-simple')
    async testSimple() {
        this.logger.log('🧪 Testing simple publish (no RPC)...');

        try {
            // Test simple publish
            await this.amqp.publish('demo.exchange2', 'subscribe.routing.key', {
                payload: { message: 'Hello from simple test!' },
                source: 'test',
                type: 'simple-test',
            });

            return {
                exchange: 'demo.exchange2',
                message: 'Message published successfully',
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
}
