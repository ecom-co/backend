import { StringField } from '@ecom-co/utils';

export class CreateExample2Dto {
    @StringField({
        description: 'Product name',
        example: 'Product name',
        maxLength: 100,
        minLength: 3,
        name: 'name',
    })
    name!: string;
}
