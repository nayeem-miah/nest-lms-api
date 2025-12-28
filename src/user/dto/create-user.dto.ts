import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../../enums/user.types";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(6)
    @MaxLength(20)
    @IsOptional()
    password?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole

    @IsOptional()
    @IsString()
    profilePhoto?: string;

    @IsOptional()
    @IsArray()
    devices?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
