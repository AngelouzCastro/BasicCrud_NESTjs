import { IsNotEmpty, MinLength, MaxLength, IsEmail } from "class-validator";

export class LoginUserDto {
    @MinLength(4)
    @MaxLength(12)
    @IsNotEmpty()
    password: string

    @IsEmail()
    @IsNotEmpty()
    email: string;
}