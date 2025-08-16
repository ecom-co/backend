import { ApiEndpoint, ApiValidationEndpoint, AUTH_TYPE, PAGINATION_TYPE } from '@ecom-co/utils';
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';

import { ExampleResponseDto } from '@/modules/example/dto/response-example.dto';
import { UpdateExampleDto } from '@/modules/example/dto/update-example.dto';

import { CreateExampleDto } from './dto/create-example.dto';
import { ExampleService } from './example.service';

@Controller('example')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @Post()
    @ApiValidationEndpoint({
        summary: 'Create a new example',
        description: 'Creates a new example record.',
        responses: {
            [HttpStatus.CREATED]: {
                type: ExampleResponseDto,
                description: 'Example created',
            },
        },
        auth: [{ type: AUTH_TYPE.JWT, provider: 'access-token', required: false }],
        errors: [HttpStatus.CONFLICT],
        body: { type: CreateExampleDto },
        validation: {
            errorExamples: [
                { field: 'name', constraint: 'isNotEmpty', message: 'Namne should not be empty' },
                { field: 'email', constraint: 'isEmail', message: 'email must be an email' },
            ],
        },
        tags: ['User'],
    })
    create(@Body() createExampleDto: CreateExampleDto) {
        return this.exampleService.create(createExampleDto);
    }

    @Get()
    @ApiEndpoint({
        summary: 'Create a new example',
        description: 'Creates a new example record.',
        responses: {
            [HttpStatus.OK]: {
                type: ExampleResponseDto,
                description: 'Example created',
            },
        },
        queries: [{ name: 'limit', type: 'number', description: 'Limit' }],
        paginationType: PAGINATION_TYPE.OFFSET,
        auth: { type: AUTH_TYPE.JWT, required: true },
        errors: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
    })
    findAll(@Query('limit') limit: number) {
        return this.exampleService.findAll({ limit: limit ?? 10 });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.exampleService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
        return this.exampleService.update(+id, updateExampleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.exampleService.remove(+id);
    }

    // --- Elasticsearch demo endpoints ---
    @Post('es/products')
    esCreateOne(@Body() body: { id: string; name: string; price: number }) {
        return this.exampleService.esInsertOne(body);
    }

    @Post('es/products/bulk')
    esBulk(@Body() body: Array<{ id: string; name: string; price: number }>) {
        return this.exampleService.esBulkInsert(body);
    }

    @Post('es/products/tags')
    esCreateWithTags(
        @Body()
        body: {
            id: string;
            name: string;
            price: number;
            tags: Array<{ id: string; name: string }>;
        },
    ) {
        return this.exampleService.esInsertWithTags(body);
    }

    @Post('es/products/upsert')
    esUpsert(@Body() body: { id: string; name?: string; price?: number }) {
        return this.exampleService.esUpsert(body);
    }

    @Get('es/products/search')
    esSearch(@Query('q') q: string) {
        return this.exampleService.esSearch(q ?? '');
    }

    @Delete('es/products/:id')
    esDelete(@Param('id') id: string) {
        return this.exampleService.esDeleteById(id);
    }

    @Get('es/products')
    esGetAll() {
        return this.exampleService.esGetAll();
    }

    @Get('es/products/sources')
    esGetAllSources() {
        return this.exampleService.esGetAllSources();
    }

    @Get('es/products/search/advanced')
    esSearchAdvanced(
        @Query('name') name?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('tagId') tagId?: string,
    ) {
        return this.exampleService.esSearchAdvanced({
            name,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            tagId,
        });
    }
}
