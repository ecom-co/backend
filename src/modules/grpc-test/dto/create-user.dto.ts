import { EmailField, IsNotEmpty, IsOptional, PasswordField, StringField } from '@ecom-co/utils';

export class CreateUserDto {
    @EmailField({
        description: 'User email address',
        example: 'user@example.com',
        toLowerCase: true,
    })
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @StringField({
        description: 'User unique username',
        example: 'john_doe',
        maxLength: 30,
        minLength: 3,
        trim: true,
    })
    username?: string;

    @IsNotEmpty()
    @StringField({
        description: 'User first name',
        example: 'John',
        maxLength: 50,
        minLength: 1,
        trim: true,
    })
    firstName: string;

    @IsOptional()
    @StringField({
        description: 'User last name',
        example: 'Doe',
        maxLength: 50,
        minLength: 1,
        trim: true,
    })
    lastName?: string;

    @IsNotEmpty()
    @PasswordField(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
        description: 'User password - must contain at least 6 characters with letters and numbers',
        example: 'Nampronam1!',
    })
    password: string;
}
