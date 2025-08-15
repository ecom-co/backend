import { ApiProperty, IsOptional, IsNotEmpty } from '@ecom-co/utils';

export class CreateExampleDto {
    @ApiProperty({
        name: 'name',
        description: 'The name of the example',
        type: String,
    })
    @IsOptional()
    @IsNotEmpty({
        message: 'Name is required',
    })
    name: string;
}
