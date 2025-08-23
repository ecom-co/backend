import { Injectable } from '@nestjs/common';

import { CreateExample2Dto } from '@/modules/example-2/dto/create-example-2.dto';
import { UpdateExample2Dto } from '@/modules/example-2/dto/update-example-2.dto';

@Injectable()
export class Example2Service {
    create(_createExample2Dto: CreateExample2Dto) {
        return 'This action adds a new example2';
    }

    findAll() {
        return 'This action returns all example2';
    }

    findOne(id: string) {
        return `This action returns a #${id} example2`;
    }

    update(id: string, _updateExample2Dto: UpdateExample2Dto) {
        return `This action updates a #${id} example2`;
    }

    remove(id: string) {
        return `This action removes a #${id} example2`;
    }
}
