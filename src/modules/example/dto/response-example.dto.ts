import { assign } from 'lodash';

import { User } from '@ecom-co/orm';
import { ApiProperty, Exclude, Expose, plainToInstance } from '@ecom-co/utils';

@Exclude()
export class ExampleResponseDto {
    @ApiProperty({ description: 'Example ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    @Expose()
    id: string;

    @ApiProperty({ description: 'Example Name', example: 'Demo name' })
    @Expose()
    name: string;

    @ApiProperty({ description: 'Example is active', example: true })
    @Expose()
    isActive: boolean;

    constructor(partial: Partial<User>) {
        assign(this, plainToInstance(ExampleResponseDto, partial, { excludeExtraneousValues: true }));
    }
}
