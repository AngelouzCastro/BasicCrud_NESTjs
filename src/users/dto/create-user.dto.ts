import { IsNotEmpty, MinLength, MaxLength, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @MinLength(4)
    @MaxLength(12)
    @IsNotEmpty()
    password: string

    @IsEmail()
    @IsNotEmpty()
    email: string;
}