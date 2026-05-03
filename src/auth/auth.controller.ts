import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { Public } from './decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @Public()
	@Post('register')
    async register(@Request() req) {
        return await this.authService.register(req.user);
    }


    @Public()
	@Post('refresh')
	async refreshToken(@Body() dto: any){
		return await this.authService.refresh(dto);
	}
}
