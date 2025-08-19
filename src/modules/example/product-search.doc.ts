import { Document, Field } from '@ecom-co/elasticsearch';

@Document({ index: 'products' })
export class ProductSearchDoc {
    @Field({ type: 'keyword' })
    id!: string;

    @Field({ analyzer: 'standard', fields: { keyword: { type: 'keyword' } }, type: 'text' })
    name!: string;

    @Field({ type: 'double' })
    price!: number;

    @Field({
        properties: {
            id: { type: 'keyword' },
            name: { fields: { keyword: { type: 'keyword' } }, type: 'text' },
        },
        type: 'nested',
    })
    tags?: Array<{ id: string; name: string }>;
}
