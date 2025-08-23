import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, BadRequestException } from '@nestjs/common';

import { ApiEndpoint, ApiValidationEndpoint, AUTH_TYPE, PAGINATION_TYPE } from '@ecom-co/utils';

import { CreateExampleDto } from '@/modules/example/dto/create-example.dto';
import { ExampleResponseDto } from '@/modules/example/dto/response-example.dto';
import { UpdateExampleDto } from '@/modules/example/dto/update-example.dto';
import { ExampleService } from '@/modules/example/example.service';

@Controller('example')
export class ExampleController {
    constructor(private readonly exampleService: ExampleService) {}

    @ApiValidationEndpoint({
        auth: [{ type: AUTH_TYPE.JWT, provider: 'access-token', required: false }],
        body: { type: CreateExampleDto },
        description: 'Creates a new example record.',
        errors: [HttpStatus.CONFLICT],
        responses: {
            [HttpStatus.CREATED]: {
                type: ExampleResponseDto,
                description: 'Example created',
            },
        },
        summary: 'Create a new example',
        tags: ['User'],
        validation: {
            errorExamples: [
                { constraint: 'isNotEmpty', field: 'name', message: 'Name should not be empty' }, // Fixed typo: "Namne" -> "Name"
                { constraint: 'isEmail', field: 'email', message: 'email must be an email' },
            ],
        },
    })
    @Post()
    create(@Body() createExampleDto: CreateExampleDto) {
        return this.exampleService.create(createExampleDto);
    }

    // --- Elasticsearch demo endpoints ---
    @ApiEndpoint({
        auth: { type: AUTH_TYPE.JWT, required: true },
        description: 'Creates a new example record.',
        errors: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
        paginationType: PAGINATION_TYPE.OFFSET,
        queries: [{ name: 'limit', type: 'number', description: 'Limit' }],
        responses: {
            [HttpStatus.OK]: {
                type: ExampleResponseDto,
                description: 'Example created',
            },
        },
        summary: 'Create a new example',
    })
    @Get()
    findAll(@Query('limit') limit: number) {
        return this.exampleService.findAll({ limit: limit ?? 10 });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.exampleService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
        return this.exampleService.update(id, updateExampleDto); // Fixed: Use string ID consistently
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.exampleService.remove(id); // Fixed: Use string ID consistently
    }

    @Post('es/products/bulk')
    esBulk(@Body() body: Array<{ id: string; name: string; price: number }>) {
        return this.exampleService.esBulkInsert(body);
    }

    @Post('es/products')
    esCreateOne(@Body() body: { id: string; name: string; price: number }) {
        return this.exampleService.esInsertOne(body);
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

    @Get('es/products/search')
    esSearch(@Query('q') q: string) {
        // Provide default value if query is empty
        return this.exampleService.esSearch(q || '*');
    }

    @Get('es/products/search/advanced')
    esSearchAdvanced(
        @Query('name') name?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('tagId') tagId?: string,
    ) {
        // Parse and validate numeric parameters
        const parsedMinPrice = minPrice ? Number(minPrice) : undefined;
        const parsedMaxPrice = maxPrice ? Number(maxPrice) : undefined;

        // Validate numeric values
        if (minPrice && (isNaN(parsedMinPrice!) || parsedMinPrice! < 0)) {
            throw new BadRequestException('Invalid minPrice parameter');
        }
        if (maxPrice && (isNaN(parsedMaxPrice!) || parsedMaxPrice! < 0)) {
            throw new BadRequestException('Invalid maxPrice parameter');
        }

        return this.exampleService.esSearchAdvanced({
            name,
            maxPrice: parsedMaxPrice,
            minPrice: parsedMinPrice,
            tagId,
        });
    }

    @Post('es/products/upsert')
    esUpsert(@Body() body: { id: string; name?: string; price?: number }) {
        return this.exampleService.esUpsert(body);
    }
}
