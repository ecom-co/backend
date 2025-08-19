import { IsString, StringField } from '@ecom-co/utils';

export class CreateExampleDto {
    @IsString()
    @StringField({
        name: 'name',
        description: 'Product name',
        example: 'Product name',
        messages: {
            required: 'Name is required',
        },
        required: true,
    })
    name!: string;
}
