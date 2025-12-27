import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    deviceId: string;
}


export class ChangePasswordDto {
    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}
