import { getRepositoryToken, User } from '@ecom-co/orm';
import { getRedisFacadeToken } from '@ecom-co/redis';
import { Test, TestingModule } from '@nestjs/testing';

import { Example2Service } from '@/modules/example-2/example-2.service';

import { ExampleService } from './example.service';

describe('ExampleService', () => {
    let service: ExampleService;

    const mockExample2Service = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const mockUserRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    const mockRedisClient = {
        get: jest.fn(),
        set: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExampleService,
                {
                    provide: Example2Service,
                    useValue: mockExample2Service,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRedisFacadeToken(),
                    useValue: mockRedisClient,
                },
            ],
        }).compile();

        service = module.get<ExampleService>(ExampleService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
