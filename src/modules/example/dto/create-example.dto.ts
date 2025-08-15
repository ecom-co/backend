import { IsString, StringField } from '@ecom-co/utils';

export class CreateExampleDto {
    @StringField({
        name: 'name',
        required: true,
        description: 'Product name',
        example: 'Product name',
        messages: {
            required: 'Name is required',
        },
    })
    @IsString()
    name!: string;
}
