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

    constructor(partial: Partial<ExampleResponseDto>) {
        assign(this, plainToInstance(ExampleResponseDto, partial, { excludeExtraneousValues: true }));
    }
}
