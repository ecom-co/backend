import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';

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
        return this.exampleService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
        return this.exampleService.update(+id, updateExampleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.exampleService.remove(+id);
    }
}
