import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { Public } from './decorators/public.decorator.js';
import { LoginUserDto, RegisterUserDto } from './dto/user.dto.js';
import { RefreshTokenDto, ResponseTokensDto } from './dto/tokens.dto.js';
import { Roles } from './decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Body() user: LoginUserDto): Promise<ResponseTokensDto> {
        return await this.authService.login(user);
    }

    @Public()
	@Post('register')
    async register(@Body() user: RegisterUserDto): Promise<ResponseTokensDto> {
        return await this.authService.register(user);
    }

    @Public()
	@Post('refresh')
	async refreshToken(@Body() dto: RefreshTokenDto): Promise<ResponseTokensDto> {
		return await this.authService.refresh(dto.refreshToken);
	}

    @Roles(Role.STUDENT)
    @Get()
    async Hello(){
        return "helo";
    }

}
