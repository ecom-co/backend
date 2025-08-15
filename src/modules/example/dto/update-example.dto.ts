import { PartialType } from '@ecom-co/utils';

import { CreateExampleDto } from './create-example.dto';

export class UpdateExampleDto extends PartialType(CreateExampleDto) {}
