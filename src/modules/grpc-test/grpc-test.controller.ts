import { Body, Controller, Get, Param, Post, Query, BadRequestException } from '@nestjs/common';

import { ApiPaginatedResponseData, ApiResponseData } from '@ecom-co/utils';
import { Observable } from 'rxjs';

import { CreateUserDto } from '@/modules/grpc-test/dto/create-user.dto';
import { UserResponseDto } from '@/modules/grpc-test/dto/user-response.dto';

import { GrpcTestService } from './grpc-test.service';

@Controller('grpc-test')
export class GrpcTestController {
    constructor(private readonly grpcTestService: GrpcTestService) {}

    @Post('users')
    createUser(@Body() createUserDto: CreateUserDto): Observable<ApiResponseData<UserResponseDto>> {
        return this.grpcTestService.createUser(createUserDto);
    }

    @Get('users/:id')
    getUser(@Param('id') id: string): Observable<ApiResponseData<UserResponseDto>> {
        return this.grpcTestService.getUser(id);
    }

    @Get('users')
    listUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ): Observable<ApiPaginatedResponseData<UserResponseDto>> {
        // Parse and validate pagination parameters
        const parsedPage = page ? Number(page) : 1;
        const parsedLimit = limit ? Number(limit) : 10;

        // Validate parameters
        if (page && (isNaN(parsedPage) || parsedPage < 1)) {
            throw new BadRequestException('Invalid page parameter');
        }
        if (limit && (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100)) {
            throw new BadRequestException('Invalid limit parameter (must be between 1 and 100)');
        }

        return this.grpcTestService.listUsers(parsedPage, parsedLimit);
    }
}
