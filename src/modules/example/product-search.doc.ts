import { Document, Field } from '@ecom-co/elasticsearch';

@Document({ index: 'products' })
export class ProductSearchDoc {
    @Field({ type: 'keyword' })
    id!: string;

    @Field({ type: 'text', analyzer: 'standard', fields: { keyword: { type: 'keyword' } } })
    name!: string;

    @Field({ type: 'double' })
    price!: number;

    @Field({
        type: 'nested',
        properties: {
            id: { type: 'keyword' },
            name: { type: 'text', fields: { keyword: { type: 'keyword' } } },
        },
    })
    tags?: Array<{ id: string; name: string }>;
}
