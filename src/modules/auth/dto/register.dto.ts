import { ApiProperty, IsEmail, IsNotEmpty, IsString } from '@ecom-co/utils';

export class RegisterDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The username of the user',
        example: 'john_doe',
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password123',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
