import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { getRepositoryToken as getEsRepositoryToken } from '@ecom-co/elasticsearch';
import { getRepositoryToken as getOrmRepositoryToken, User } from '@ecom-co/orm';
import { getRedisFacadeToken } from '@ecom-co/redis';
import { of } from 'rxjs';

import { AuthGrpcClient } from '@/modules/auth/auth.grpc.client';
import { Example2Service } from '@/modules/example-2/example-2.service';

import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { ProductSearchDoc } from './product-search.doc';

describe('ExampleController', () => {
    let controller: ExampleController;

    const mockExample2Service = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
        update: jest.fn(),
    };

    const mockUserRepository = {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
    };

    const mockEsRepo = {
        bulkIndex: jest.fn(),
        indexOne: jest.fn(),
        refresh: jest.fn(),
        search: jest.fn(),
        searchSources: jest.fn(),
        deleteById: jest.fn(),
        upsertById: jest.fn(),
    };
    const mockEsRepoAnalytics = { ...mockEsRepo };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExampleController],
            providers: [
                ExampleService,
                {
                    provide: Example2Service,
                    useValue: mockExample2Service,
                },
                {
                    provide: getOrmRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRedisFacadeToken(),
                    useValue: { get: jest.fn(), set: jest.fn() },
                },
                {
                    provide: getEsRepositoryToken(ProductSearchDoc),
                    useValue: mockEsRepo,
                },
                {
                    provide: getEsRepositoryToken(ProductSearchDoc, 'analytics'),
                    useValue: mockEsRepoAnalytics,
                },
                {
                    provide: 'AUTH_SERVICE',
                    useValue: {
                        getService: jest.fn().mockReturnValue({
                            CheckAccess: jest.fn().mockReturnValue(of({ allowed: true })),
                        }),
                    },
                },
                AuthGrpcClient,
            ],
        }).compile();

        controller = module.get<ExampleController>(ExampleController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
