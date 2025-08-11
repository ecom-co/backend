import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';

import { AUTH_TYPE } from '@/core/constants';
import { PAGINATION_TYPE } from '@/core/constants/pagination.constants';
import { ApiEndpoint } from '@/core/decorators/api-endpoint.decorator';
import { ExampleResponseDto } from '@/modules/example/dto/response-example.dto';

import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { ExampleService } from './example.service';

@Controller('example')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @Post()
    @ApiEndpoint({
        summary: 'Create a new example',
        description: 'Creates a new example record.',
        response: ExampleResponseDto,
        created: true,
        auth: { type: [AUTH_TYPE.JWT] },
        errors: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
    })
    create(@Body() createExampleDto: CreateExampleDto) {
        return this.exampleService.create(createExampleDto);
    }

    @Get()
    @ApiEndpoint({
        summary: 'Create a new example',
        description: 'Creates a new example record.',
        response: ExampleResponseDto,
        paginationType: PAGINATION_TYPE.OFFSET,
        created: true,
        auth: { type: [AUTH_TYPE.JWT] },
        errors: [],
    })
    findAll() {
        return this.exampleService.findAll();
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
