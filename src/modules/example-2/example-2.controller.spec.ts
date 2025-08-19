import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { Example2Controller } from './example-2.controller';
import { Example2Service } from './example-2.service';

describe('Example2Controller', () => {
    let controller: Example2Controller;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Example2Controller],
            providers: [Example2Service],
        }).compile();

        controller = module.get<Example2Controller>(Example2Controller);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
