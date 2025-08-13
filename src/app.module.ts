import { ElasticsearchModule } from '@ecom-co/elasticsearch';
import { CORE_ENTITIES, OrmModule } from '@ecom-co/orm';
import { RedisModule } from '@ecom-co/redis';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigModule } from '@/modules/config/config.module';
import { ConfigServiceApp } from '@/modules/config/config.service';
import { ExampleModule } from '@/modules/example/example.module';
import { ProductSearchDoc } from '@/modules/example/product-search.doc';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { Example2Module } from './modules/example-2/example-2.module';

@Module({
    imports: [
        NestConfigModule.forRoot(),
        OrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigServiceApp],
            useFactory: (configService: ConfigServiceApp) => ({
                type: 'postgres',
                url: configService.databaseUrl,
                synchronize: configService.isDevelopment,
                logging: configService.isDevelopment,
                entities: [...CORE_ENTITIES],
                autoLoadEntities: true,
                health: true,
                keepConnectionAlive: true,
                retryAttempts: 10,
                retryDelay: 3000,
                extra: {
                    max: 10,
                    connectionTimeoutMillis: 5000,
                    idleTimeoutMillis: 30000,
                },
            }),
        }),
        RedisModule.forRootAsync({
            inject: [ConfigServiceApp],
            useFactory: (config: ConfigServiceApp) => ({
                clients: [
                    {
                        type: 'single',
                        name: 'default',
                        connectionString: config.redisUrl,
                    },
                ],
            }),
            // predeclare: ['forward'],
        }),
        ElasticsearchModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigServiceApp],
            useFactory: () => ({
                clients: [
                    { name: 'default', node: 'http://localhost:9201' },
                    { name: 'analytics', node: 'http://localhost:9201' },
                ],
                autoCreateIndices: true,
                documents: [ProductSearchDoc],
            }),
            predeclare: ['analytics'],
        }),
        ConfigModule,
        ExampleModule,
        Example2Module,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
