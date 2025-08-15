import { User } from '@ecom-co/orm';
import { Exclude, Expose, ApiProperty, plainToInstance } from '@ecom-co/utils';
import { assign } from 'lodash';

@Exclude()
export class ExampleResponseDto {
    @Expose()
    @ApiProperty({ description: 'Example ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @Expose()
    @ApiProperty({ description: 'Example Name', example: 'Demo name' })
    name: string;

    @Expose()
    @ApiProperty({ description: 'Example is active', example: true })
    isActive: boolean;

    constructor(partial: Partial<User>) {
        assign(this, plainToInstance(ExampleResponseDto, partial, { excludeExtraneousValues: true }));
    }
}
