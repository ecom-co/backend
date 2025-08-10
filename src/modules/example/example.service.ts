import { InjectRepository, Repository, User } from '@ecom-co/orm';
import { InjectRedisFacade, RedisFacade } from '@ecom-co/redis';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Injectable()
export class ExampleService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRedisFacade() private readonly cache: RedisFacade,
    ) {}

    create(_createExampleDto: CreateExampleDto) {
        return 'This action adds a new example';
    }

    async findAll() {
        const usersRedis: User[] | null = await this.cache.getJson<User[]>('users');
        if (usersRedis) {
            return usersRedis;
        }
        const users = await this.userRepository.find({
            select: {
                name: true,
                isActive: true,
                id: true,
            },
        });
        await this.cache.setJson('users', users, {
            ttlSeconds: 60,
        });
        return users;
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const uuids = Array.from({ length: 4 }, () => uuidv4());
        const now = Date.now();

        for (const sid of uuids) {
            // 1️⃣ Lưu sessionId vào danh sách session của user (Sorted Set)
            await this.cache.zaddObject(`user_auth:user:${id}`, [{ score: now, member: sid }]);

            // 2️⃣ Lưu chi tiết session (Hash)
            await this.cache.hmsetObject(`user_auth:session:${sid}`, {
                ip: '127.0.0.1',
                ua: 'NestJS-Demo',
                loginAt: now,
            });

            // 3️⃣ TTL 7 ngày cho session
            await this.cache.expire(`user_auth:session:${sid}`, 60 * 60 * 24 * 7);
        }

        return {
            ...user,
            createdSessions: uuids,
        };
    }

    update(id: number, _updateExampleDto: UpdateExampleDto) {
        return `This action updates a #${id} example`;
    }

    remove(id: number) {
        return `This action removes a #${id} example`;
    }
}
