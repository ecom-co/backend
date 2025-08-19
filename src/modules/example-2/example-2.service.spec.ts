import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { Example2Service } from './example-2.service';

describe('Example2Service', () => {
    let service: Example2Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [Example2Service],
        }).compile();

        service = module.get<Example2Service>(Example2Service);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
