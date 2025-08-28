import { assign } from 'lodash';

import { ApiProperty, Exclude, Expose, plainToInstance } from '@ecom-co/utils';

@Exclude()
export class UserAuthDto {
    @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Email address', example: 'john@doe.com' })
    @Expose()
    email: string;

    @ApiProperty({ description: 'Username', example: 'jdoe' })
    @Expose()
    username: string;

    @ApiProperty({ description: 'Active status', example: true })
    @Expose()
    isActive: boolean;

    @ApiProperty({ description: 'First name', example: 'John' })
    @Expose()
    firstName: string;

    @ApiProperty({ description: 'Full name', example: 'John Doe' })
    @Expose()
    fullName: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    @Expose()
    lastName: string;

    @ApiProperty({ description: 'Created at ISO date', example: '2024-01-01T00:00:00.000Z' })
    @Expose()
    createdAt: string;

    @ApiProperty({ description: 'Updated at ISO date', example: '2024-01-02T00:00:00.000Z' })
    @Expose()
    updatedAt: string;

    constructor(partial: Partial<UserAuthDto>) {
        assign(this, plainToInstance(UserAuthDto, partial, { excludeExtraneousValues: true }));
    }
}
