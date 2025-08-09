import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExampleDto {
    @ApiProperty({
        name: 'name',
        description: 'The name of the example',
        type: String,
    })
    @IsOptional()
    @IsNotEmpty({
        message: 'Thằng này dell empty',
    })
    name: string;
}
