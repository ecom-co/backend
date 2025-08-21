import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { ApiPaginatedResponseData, ApiResponseData } from '@ecom-co/utils';
import { Observable } from 'rxjs';

import { CreateUserDto } from '@/modules/grpc-test/dto/create-user.dto';
import { UserResponseDto } from '@/modules/grpc-test/dto/user-response.dto';

import { GrpcTestService } from './grpc-test.service';

@Controller('grpc-test')
export class GrpcTestController {
    constructor(private readonly grpcTestService: GrpcTestService) {}

    @Post('users')
    createUser(@Body() body: CreateUserDto): Observable<ApiResponseData<UserResponseDto>> {
        return this.grpcTestService.createUser(body.name, body.email, body.password);
    }

    @Get('users/:id')
    getUser(@Param('id') id: string): Observable<ApiResponseData<UserResponseDto>> {
        return this.grpcTestService.getUser(id);
    }

    @Get('users')
    listUsers(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<ApiPaginatedResponseData<UserResponseDto>> {
        return this.grpcTestService.listUsers(page, limit);
    }
}
