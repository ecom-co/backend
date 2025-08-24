import { ApiProperty } from '@nestjs/swagger';

import { assign } from 'lodash';

import { User } from '@ecom-co/orm';
import { plainToInstance } from '@ecom-co/utils';

export class UserResponseDto {
    @ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'User email address',
        example: 'john.doe@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'User unique username',
        example: 'johndoe123',
        required: false,
    })
    username?: string;

    @ApiProperty({
        default: true,
        description: 'Indicates whether the user account is active',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'User first name',
        example: 'John',
    })
    firstName: string;

    @ApiProperty({
        description: 'User full name (firstName + lastName)',
        example: 'John Doe',
    })
    fullName: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
    })
    lastName: string;

    @ApiProperty({
        description: 'User creation date',
        example: '2024-01-01T00:00:00.000Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'User last update date',
        example: '2024-01-01T00:00:00.000Z',
    })
    updatedAt: string;

    constructor(partial: Partial<User>) {
        assign(this, plainToInstance(UserResponseDto, partial, { excludeExtraneousValues: true }));
    }
}
