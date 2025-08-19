import { IsString, StringField } from '@ecom-co/utils';

export class CreateExampleDto {
    @IsString()
    @StringField({
        description: 'Product name',
        example: 'Product name',
        messages: {
            required: 'Name is required',
        },
        name: 'name',
        required: true,
    })
    name!: string;
}
