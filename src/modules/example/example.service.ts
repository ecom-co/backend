import { Injectable } from '@nestjs/common';

import { Example2Service } from '@/modules/example-2/example-2.service';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Injectable()
export class ExampleService {
    constructor(private readonly example2Service: Example2Service) {}

    create(createExampleDto: CreateExampleDto) {
        return 'This action adds a new example';
    }

    findAll() {
        return 'This action returns all example';
    }

    findOne(id: number) {
        return `This action returns a #${id} example`;
    }

    update(id: number, updateExampleDto: UpdateExampleDto) {
        return `This action updates a #${id} example`;
    }

    remove(id: number) {
        return `This action removes a #${id} example`;
    }
}
