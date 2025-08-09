import { TypeOrmModule, User } from '@ecom-co/orm';
import { Module } from '@nestjs/common';

import { Example2Module } from '@/modules/example-2/example-2.module';

import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
    imports: [Example2Module, TypeOrmModule.forFeature([User])],
    controllers: [ExampleController],
    providers: [ExampleService],
})
export class ExampleModule {}
