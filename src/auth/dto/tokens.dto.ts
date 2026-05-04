import { IsNotEmpty, IsString } from "class-validator";

export class ResponseTokensDto {
    accessToken!: string;
    refreshToken!: string;
}

export class RefreshTokenDto{
    @IsNotEmpty()
    @IsString()
    refreshToken!: string; 
}
