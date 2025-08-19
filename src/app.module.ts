import { Module } from '@nestjs/common';

import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ElasticsearchModule } from '@ecom-co/elasticsearch';
import { CORE_ENTITIES, OrmModule } from '@ecom-co/orm';
import { RedisModule } from '@ecom-co/redis';

import { ConfigModule } from '@/modules/config/config.module';
import { ConfigServiceApp } from '@/modules/config/config.service';
import { ExampleModule } from '@/modules/example/example.module';
import { ProductSearchDoc } from '@/modules/example/product-search.doc';
import { RabbitmqModule } from '@/modules/rabbitmq/rabbitmq.module';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
    imports: [
        NestConfigModule.forRoot(),
        OrmModule.forRootAsync({
            inject: [ConfigServiceApp],
            useFactory: (configService: ConfigServiceApp) => ({
                type: 'postgres',
                autoLoadEntities: true,
                entities: [...CORE_ENTITIES],
                extra: {
                    connectionTimeoutMillis: 5000,
                    idleTimeoutMillis: 30000,
                    max: 10,
                },
                health: true,
                keepConnectionAlive: true,
                logging: configService.isDevelopment,
                retryAttempts: 10,
                retryDelay: 3000,
                synchronize: configService.isDevelopment,
                url: configService.databaseUrl,
            }),
            imports: [ConfigModule],
        }),
        RedisModule.forRootAsync({
            inject: [ConfigServiceApp],
            useFactory: (_config: ConfigServiceApp) => ({
                clients: [
                    {
                        name: 'default',
                        type: 'single',
                        connectionString:
                            'redis://default:ktbdyR27K6ESECTRs3GSHRaK2oQcvKES@redis-15417.c15.us-east-1-4.ec2.redns.redis-cloud.com:15417',
                    },
                ],
            }),
            // predeclare: ['forward'],
        }),
        ElasticsearchModule.forRootAsync({
            inject: [ConfigServiceApp],
            predeclare: ['analytics'],
            useFactory: (config: ConfigServiceApp) => ({
                autoCreateIndices: true,
                clients: [
                    { name: 'default', node: config.elasticsearchUrl },
                    { name: 'analytics', node: config.elasticsearchUrl },
                ],
                documents: [ProductSearchDoc],
            }),
            imports: [ConfigModule],
        }),
        RabbitmqModule,

        ConfigModule,
        ExampleModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
