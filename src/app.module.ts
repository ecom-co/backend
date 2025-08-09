import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigModule } from '@/modules/config/config.module';
import { ExampleModule } from '@/modules/example/example.module';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { Example2Module } from './modules/example-2/example-2.module';

@Module({
    imports: [NestConfigModule.forRoot(), ConfigModule, ExampleModule, Example2Module],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
