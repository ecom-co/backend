import { ElasticsearchModule } from '@ecom-co/elasticsearch';
import { OrmModule, User } from '@ecom-co/orm';
import { RedisModule } from '@ecom-co/redis';
import { Module } from '@nestjs/common';

import { Example2Module } from '@/modules/example-2/example-2.module';

import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { ProductSearchDoc } from './product-search.doc';

@Module({
    imports: [
        Example2Module,
        OrmModule.forFeatureExtended([User]),
        RedisModule,
        ElasticsearchModule.forFeature([ProductSearchDoc]),
        ElasticsearchModule.forFeature([ProductSearchDoc], 'analytics'),
    ],
    controllers: [ExampleController],
    providers: [ExampleService],
})
export class ExampleModule {}
