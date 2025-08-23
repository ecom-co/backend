import { Inject, Injectable, Logger } from '@nestjs/common';

import { ApiPaginatedResponseData, ApiResponseData } from '@ecom-co/utils';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

interface UserService {
    CreateUser: (data: CreateUserDto) => Observable<ApiResponseData<UserResponseDto>>;
    GetUser: (data: { id: string }) => Observable<ApiResponseData<UserResponseDto>>;
    ListUsers: (data: { limit: number; page: number }) => Observable<ApiPaginatedResponseData<UserResponseDto>>;
}

@Injectable()
export class GrpcTestService {
    private readonly logger = new Logger(GrpcTestService.name);
    private userService: UserService;

    constructor(
        @Inject('USER_SERVICE')
        private readonly userClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.userService = this.userClient.getService<UserService>('UserService');
    }

    createUser(createUserDto: CreateUserDto) {
        return this.userService.CreateUser(createUserDto).pipe(
            tap((response) => {
                this.logger.log(`[createUser] Response: ${JSON.stringify(response)}`);
            }),
            map(
                (response) =>
                    new ApiResponseData({
                        data: response.data,
                        message: response.message,
                        statusCode: response.statusCode,
                    }),
            ),
        );
    }

    getUser(id: string) {
        return this.userService.GetUser({ id }).pipe(
            tap((response) => {
                this.logger.log(`[getUser] Response: ${JSON.stringify(response)}`);
            }),
            map(
                (response) =>
                    new ApiResponseData({
                        data: response.data,
                        message: response.message,
                        statusCode: response.statusCode,
                    }),
            ),
        );
    }

    listUsers(page: number = 1, limit: number = 10) {
        return this.userService
            .ListUsers({
                limit,
                page,
            })
            .pipe(
                tap((response) => {
                    this.logger.log(`[listUsers] Response: ${JSON.stringify(response)}`);
                }),
                map(
                    (response) =>
                        new ApiPaginatedResponseData({
                            data: response.data,
                            message: response.message,
                            paging: response.paging,
                            statusCode: response.statusCode,
                        }),
                ),
            );
    }
}
