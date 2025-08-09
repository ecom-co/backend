import { CORE_ENTITIES, TypeOrmModule } from '@ecom-co/orm';
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigModule } from '@/modules/config/config.module';
import { ConfigServiceApp } from '@/modules/config/config.service';
import { ExampleModule } from '@/modules/example/example.module';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { Example2Module } from './modules/example-2/example-2.module';

@Module({
    imports: [
        NestConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigServiceApp],
            useFactory: (configService: ConfigServiceApp) => ({
                type: 'postgres',
                url: configService.databaseUrl,
                synchronize: configService.isDevelopment,
                logging: configService.isDevelopment,
                entities: [...CORE_ENTITIES],
                autoLoadEntities: true,
            }),
        }),
        ConfigModule,
        ExampleModule,
        Example2Module,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
