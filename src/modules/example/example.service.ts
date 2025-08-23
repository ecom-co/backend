import { HttpStatus, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { map } from 'lodash';

import { EsRepository, InjectEsRepository } from '@ecom-co/elasticsearch';
import { BaseRepository, InjectRepository, User } from '@ecom-co/orm';
import { InjectRedisFacade, RedisFacade } from '@ecom-co/redis';
import { ApiPaginatedResponseData, ApiResponseData, Paging } from '@ecom-co/utils';
import { v4 as uuidv4 } from 'uuid';

import { ExampleResponseDto } from '@/modules/example/dto/response-example.dto';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

import { ProductSearchDoc } from './product-search.doc';

import type { QueryDslQueryContainer, SearchResponse } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class ExampleService {
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
                name: dto.name ?? 'Anonymous',
            },
            {
                isActive: true, // Fixed: Use proper boolean instead of type coercion
            },
        );

        return new ApiResponseData({
            data: new ExampleResponseDto(result),
            message: 'Example created successfully',
            statusCode: HttpStatus.CREATED,
        });
    }

    // --- Elasticsearch demo methods ---
    async findAll({ limit }: { limit: number }): Promise<ApiPaginatedResponseData<ExampleResponseDto>> {
        const [users, total] = await this.userRepository.findAndCount({
            select: {
                id: true,
                name: true,
                isActive: true,
            },
        });

        const paging = new Paging({
            currentPageSize: users.length,
            limit,
            page: 1,
            total,
        });

        return new ApiPaginatedResponseData<ExampleResponseDto>({
            data: map(users, (user) => new ExampleResponseDto(user)),
            message: 'Users retrieved successfully',
            paging,
        });
    }

    /**
     * Find a user by ID
     * Note: This method should only retrieve user data, not create sessions
     * @param id - User ID to find
     * @returns User data
     */
    async findOne(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    /**
     * Update an example record
     * @param id - Record ID to update
     * @param updateExampleDto - Update data
     */
    update(id: string, updateExampleDto: UpdateExampleDto) {
        // TODO: Implement actual update logic
        return `This action updates a #${id} example`;
    }

    /**
     * Remove an example record
     * @param id - Record ID to remove
     */
    remove(id: string) {
        // TODO: Implement actual removal logic
        return `This action removes a #${id} example`;
    }

    /**
     * Create a user session (if needed for authentication)
     * @param userId - User ID to create session for
     * @param sessionData - Session metadata (IP, user agent, etc.)
     * @returns Session ID
     */
    async createUserSession(
        userId: string,
        sessionData: { ip: string; userAgent: string },
    ): Promise<{ sessionId: string }> {
        const sessionId = uuidv4();
        const now = Date.now();

        // Use Promise.all for parallel operations instead of sequential
        await Promise.all([
            // 1️⃣ Add sessionId to user's session list (Sorted Set)
            this.cache.zaddObject(`user_auth:user:${userId}`, [{ member: sessionId, score: now }]),

            // 2️⃣ Store session details (Hash)
            this.cache.hmsetObject(`user_auth:session:${sessionId}`, {
                ip: sessionData.ip,
                loginAt: now,
                ua: sessionData.userAgent,
            }),
        ]);

        // 3️⃣ Set TTL (7 days) for session
        await this.cache.expire(`user_auth:session:${sessionId}`, 60 * 60 * 24 * 7);

        return { sessionId };
    }

    /**
     * Bulk insert documents to Elasticsearch
     * @param docs - Array of documents to insert
     * @returns Success status
     */
    async esBulkInsert(docs: Array<{ id: string; name: string; price: number }>): Promise<{ ok: true }> {
        if (docs.length === 0) return { ok: true };

        await this.productRepo.bulkIndex(docs);
        await this.productRepo.refresh();

        return { ok: true };
    }

    /**
     * Delete a document by ID from Elasticsearch
     * @param id - Document ID to delete
     * @returns Success status
     */
    async esDeleteById(id: string): Promise<{ ok: true }> {
        if (!id?.trim()) {
            throw new BadRequestException('Document ID is required');
        }

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

    /**
     * Insert a single document to Elasticsearch
     * @param doc - Document to insert
     * @returns Success status
     */
    async esInsertOne(doc: { id: string; name: string; price: number }): Promise<{ ok: true }> {
        // Validate required fields
        if (!doc.id?.trim()) {
            throw new BadRequestException('Document ID is required');
        }
        if (!doc.name?.trim()) {
            throw new BadRequestException('Document name is required');
        }
        if (doc.price == null || doc.price < 0) {
            throw new BadRequestException('Valid price is required');
        }

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

    /**
     * Search for products across primary and secondary indices
     * @param q - Search query string
     * @returns Search results from both primary and secondary indices
     */
    async esSearch(
        q: string,
    ): Promise<{ primary: SearchResponse<ProductSearchDoc>; secondary: SearchResponse<ProductSearchDoc> }> {
        // Validate and sanitize search query
        const searchQuery = q?.trim() || '*';
        
        const [primary, secondary] = await Promise.all([
            this.productRepo.search({ q: searchQuery }),
            this.analyticsRepo.search({ q: searchQuery }),
        ]);

        return {
            primary,
            secondary,
        };
    }

    /**
     * Advanced Elasticsearch search with filters
     * @param filters - Search filters
     * @returns Array of matching products
     */
    async esSearchAdvanced(filters: {
        maxPrice?: number;
        minPrice?: number;
        name?: string;
        tagId?: string;
    }): Promise<ProductSearchDoc[]> {
        const must: QueryDslQueryContainer[] = [];
        const filter: QueryDslQueryContainer[] = [];

        if (filters.name?.trim()) {
            must.push({ match: { name: filters.name.trim() } });
        }

        if (filters.minPrice != null || filters.maxPrice != null) {
            const range: Record<string, number> = {};

            if (filters.minPrice != null && filters.minPrice >= 0) {
                range.gte = filters.minPrice;
            }

            if (filters.maxPrice != null && filters.maxPrice >= 0) {
                range.lte = filters.maxPrice;
            }

            if (Object.keys(range).length > 0) {
                filter.push({ range: { price: range } });
            }
        }

        if (filters.tagId?.trim()) {
            must.push({ 
                nested: { 
                    path: 'tags', 
                    query: { term: { 'tags.id': filters.tagId.trim() } } 
                } 
            });
        }

        const query: QueryDslQueryContainer =
            must.length || filter.length ? { bool: { filter, must } } : { match_all: {} };

        const items: ProductSearchDoc[] = await this.productRepo.searchSources({ query } as unknown);

        return items;
    }

    /**
     * Upsert a document in Elasticsearch
     * @param doc - Document data to upsert
     * @returns Success status
     */
    async esUpsert(doc: { id: string; name?: string; price?: number }): Promise<{ ok: true }> {
        if (!doc.id?.trim()) {
            throw new BadRequestException('Document ID is required');
        }

        // Filter out undefined values and validate
        const updateData: { name?: string; price?: number } = {};
        
        if (doc.name !== undefined) {
            if (doc.name.trim()) {
                updateData.name = doc.name.trim();
            }
        }
        
        if (doc.price !== undefined) {
            if (doc.price >= 0) {
                updateData.price = doc.price;
            }
        }

        await this.productRepo.upsertById(doc.id, updateData);
        await this.productRepo.refresh();

        return { ok: true };
    }
}
