import { InjectRepository, Repository, User } from '@ecom-co/orm';
import { InjectRedis, RedisClient } from '@ecom-co/redis';
import { Injectable } from '@nestjs/common';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Injectable()
export class ExampleService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRedis()
        private readonly redisCli: RedisClient,
    ) {}

    create(_createExampleDto: CreateExampleDto) {
        return 'This action adds a new example';
    }

    async findAll() {
        const usersRedis = await this.redisCli.get('users');
        if (usersRedis) {
            return JSON.parse(usersRedis) as User[];
        }
        const users = await this.userRepository.find({
            select: {
                name: true,
                isActive: true,
            },
        });
        await this.redisCli.set('users', JSON.stringify(users), 'EX', 60);
        return users;
    }

    async findOne(_id: number) {
        await this.findAll();
    }

    update(id: number, _updateExampleDto: UpdateExampleDto) {
        return `This action updates a #${id} example`;
    }

    remove(id: number) {
        return `This action removes a #${id} example`;
    }
}
