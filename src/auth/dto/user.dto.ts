import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    password!: string;
}

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    password!: string;

    @IsOptional()
    @IsEnum(Role)
    role!: Role;
}
