import { assign } from 'lodash';

import { ApiProperty, Exclude, Expose, plainToInstance } from '@ecom-co/utils';

import { UserAuthDto } from '@/modules/auth/dto';

@Exclude()
export class LoginResponseDto {
    @ApiProperty({ description: 'Access token string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @Expose()
    accessToken: string;

    @ApiProperty({ type: () => UserAuthDto, description: 'Authenticated user payload' })
    @Expose()
    user: UserAuthDto;

    constructor(partial: Partial<LoginResponseDto>) {
        assign(this, plainToInstance(LoginResponseDto, partial, { excludeExtraneousValues: true }));
    }
}
