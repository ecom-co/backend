import { PartialType } from '@nestjs/swagger';

import { CreateExample2Dto } from './create-example-2.dto';

export class UpdateExample2Dto extends PartialType(CreateExample2Dto) {}
