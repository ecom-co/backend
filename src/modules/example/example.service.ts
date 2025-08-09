import { In, InjectRepository, Like, Repository, User } from '@ecom-co/orm';
import { Injectable } from '@nestjs/common';

import { Example2Service } from '@/modules/example-2/example-2.service';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Injectable()
export class ExampleService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly example2Service: Example2Service,
    ) {}

    create(_createExampleDto: CreateExampleDto) {
        return 'This action adds a new example';
    }

    async findAll() {
        return await this.userRepository.find({
            where: {
                name: In([Like('John'), Like('Jane')]),
            },
            select: {
                name: true,
                isActive: true,
            },
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} example`;
    }

    update(id: number, _updateExampleDto: UpdateExampleDto) {
        return `This action updates a #${id} example`;
    }

    remove(id: number) {
        return `This action removes a #${id} example`;
    }
}
