import { Module } from '@nestjs/common';

import { Example2Module } from '@/modules/example-2/example-2.module';

import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
    imports: [Example2Module], // using for dependency injection for ExampleService2 (Example2Service)
    controllers: [ExampleController],
    providers: [ExampleService],
})
export class ExampleModule {}
