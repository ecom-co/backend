import { getRepositoryToken, User } from '@ecom-co/orm';
import { Test, TestingModule } from '@nestjs/testing';

import { Example2Service } from '@/modules/example-2/example-2.service';

import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

describe('ExampleController', () => {
    let controller: ExampleController;

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
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        controller = module.get<ExampleController>(ExampleController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
