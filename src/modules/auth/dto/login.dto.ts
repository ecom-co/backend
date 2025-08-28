import { ApiProperty, IsEmail, IsNotEmpty, IsString } from '@ecom-co/utils';

export class LoginDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'nam077a.ma@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'Nampronam1!',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
