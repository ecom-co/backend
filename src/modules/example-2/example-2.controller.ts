import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateExample2Dto } from './dto/create-example-2.dto';
import { UpdateExample2Dto } from './dto/update-example-2.dto';

import { Example2Service } from './example-2.service';

@Controller('example-2')
export class Example2Controller {
    constructor(private readonly example2Service: Example2Service) {}

    @Post()
    create(@Body() createExample2Dto: CreateExample2Dto) {
        return this.example2Service.create(createExample2Dto);
    }

    @Get()
    findAll() {
        return this.example2Service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.example2Service.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.example2Service.remove(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExample2Dto: UpdateExample2Dto) {
        return this.example2Service.update(+id, updateExample2Dto);
    }
}
