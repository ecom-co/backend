import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { map } from 'lodash';

import { EsRepository, InjectEsRepository } from '@ecom-co/elasticsearch';
import { BaseRepository, InjectRepository, User } from '@ecom-co/orm';
import { InjectRedisFacade, RedisFacade } from '@ecom-co/redis';
import { ApiPaginatedResponseData, ApiResponseData, Paging } from '@ecom-co/utils';
import { QueryDslQueryContainer, SearchResponse } from 'node_modules/@elastic/elasticsearch/lib/api/types';
import { v4 as uuidv4 } from 'uuid';

import { ExampleResponseDto } from '@/modules/example/dto/response-example.dto';
import { UserResponseDto } from '@/modules/grpc-test/dto/user-response.dto';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

import { ProductSearchDoc } from './product-search.doc';

@Injectable()
export class ExampleService {
    private readonly logger = new Logger(ExampleService.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: BaseRepository<User>,
        @InjectRedisFacade() private readonly cache: RedisFacade,
        @InjectEsRepository(ProductSearchDoc) private readonly productRepo: EsRepository<ProductSearchDoc>,
        @InjectEsRepository(ProductSearchDoc, 'analytics')
        private readonly analyticsRepo: EsRepository<ProductSearchDoc>,
    ) {}

    async create(dto: CreateExampleDto) {
        const result = await this.userRepository.findOneOrCreate(
            {
                firstName: dto.name ?? 'Anonymous',
            },
            {
                isActive: 1 as unknown as boolean,
            },
        );

        return new ApiResponseData({
            data: new ExampleResponseDto(result),
            message: 'Example created successfully',
            statusCode: HttpStatus.CREATED,
        });
    }

    // --- Elasticsearch demo methods ---
    async findAll({ limit }: { limit: number }): Promise<ApiPaginatedResponseData<UserResponseDto>> {
        const [users, total] = await this.userRepository.findAndCount({
            select: {
                id: true,
                email: true,
                username: true,
                isActive: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const paging = new Paging({
            currentPageSize: users.length,
            limit,
            page: 1,
            total,
        });

        this.logger.log('findAll', { users });

        return new ApiPaginatedResponseData<UserResponseDto>({
            data: map(users, (user) => new UserResponseDto(user)),
            message: 'Users retrieved successfully',
            paging,
        });
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
            await this.cache.zaddObject(`user_auth:user:${id}`, [{ member: sid, score: now }]);

            // 2️⃣ Lưu chi tiết session (Hash)
            await this.cache.hmsetObject(`user_auth:session:${sid}`, {
                ip: '127.0.0.1',
                loginAt: now,
                ua: 'NestJS-Demo',
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

    async esBulkInsert(docs: Array<{ id: string; name: string; price: number }>): Promise<{ ok: true }> {
        if (docs.length === 0) return { ok: true };

        await this.productRepo.bulkIndex(docs);
        await this.productRepo.refresh();

        return { ok: true };
    }

    async esDeleteById(id: string): Promise<{ ok: true }> {
        await this.productRepo.deleteById(id);
        await this.productRepo.refresh();

        return { ok: true };
    }

    async esGetAll(): Promise<SearchResponse<ProductSearchDoc>> {
        const res: SearchResponse<ProductSearchDoc> = await this.productRepo.search({ q: '*' });

        return res;
    }

    async esGetAllSources(): Promise<ProductSearchDoc[]> {
        const items: ProductSearchDoc[] = await this.productRepo.searchSources({ q: '*' });

        return items;
    }

    async esInsertOne(doc: { id: string; name: string; price: number }): Promise<{ ok: true }> {
        await this.productRepo.indexOne(doc, doc.id);
        await this.productRepo.refresh();

        return { ok: true };
    }

    async esInsertWithTags(doc: {
        id: string;
        name: string;
        price: number;
        tags: Array<{ id: string; name: string }>;
    }): Promise<{ ok: true }> {
        return this.esInsertOne(doc);
    }

    async esSearch(
        q: string,
    ): Promise<{ primary: SearchResponse<ProductSearchDoc>; secondary: SearchResponse<ProductSearchDoc> }> {
        const primary: SearchResponse<ProductSearchDoc> = await this.productRepo.search({ q });
        const secondary: SearchResponse<ProductSearchDoc> = await this.analyticsRepo.search({ q });

        return {
            primary,
            secondary,
        };
    }

    async esSearchAdvanced(filters: {
        maxPrice?: number;
        minPrice?: number;
        name?: string;
        tagId?: string;
    }): Promise<ProductSearchDoc[]> {
        const must: QueryDslQueryContainer[] = [];
        const filter: QueryDslQueryContainer[] = [];

        if (filters.name) must.push({ match: { name: filters.name } });

        if (filters.minPrice != null || filters.maxPrice != null) {
            const range: Record<string, number> = {};

            if (filters.minPrice != null) range.gte = filters.minPrice;

            if (filters.maxPrice != null) range.lte = filters.maxPrice;

            filter.push({ range: { price: range } });
        }

        if (filters.tagId) must.push({ nested: { path: 'tags', query: { term: { 'tags.id': filters.tagId } } } });

        const query: QueryDslQueryContainer =
            must.length || filter.length ? { bool: { filter, must } } : { match_all: {} };

        const items: ProductSearchDoc[] = await this.productRepo.searchSources({ query } as unknown);

        return items;
    }

    async esUpsert(doc: { id: string; name?: string; price?: number }): Promise<{ ok: true }> {
        await this.productRepo.upsertById(doc.id, { name: doc.name, price: doc.price });
        await this.productRepo.refresh();

        return { ok: true };
    }
}
