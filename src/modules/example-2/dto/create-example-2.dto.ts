import { StringField } from '@ecom-co/utils';

export class CreateExample2Dto {
    @StringField({
        name: 'name',
        minLength: 3,
        maxLength: 100,
        description: 'Product name',
        example: 'Product name',
    })
    name!: string;
}
