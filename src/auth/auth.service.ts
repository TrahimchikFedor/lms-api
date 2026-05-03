import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service.js';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    private readonly JWT_ACCESS_TOKEN_TTL: JwtSignOptions['expiresIn'];
    private readonly JWT_REFRESH_TOKEN_TTL: JwtSignOptions['expiresIn'];

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow(
            'JWT_ACCESS_TOKEN_TTL',
        );
        this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow(
            'JWT_REFREST_TOKEN_TTL',
        );
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password == pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        //!FIXME replace to dto
        const existsUser = await this.usersService.findOne(user.email);

        if (!existsUser) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await argon2.verify(
            existsUser.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Wrong password');
        }

        const tokens = await this.generateTokens(existsUser);
        return tokens;
    }

    async register(user: any) {
        const existsUser = await this.usersService.findOne(user.email);
        if (existsUser) {
            throw new ConflictException('This user already exists');
        }

		const newUser = await this.usersService.createUser(user);
		
		return await this.generateTokens(newUser);
    } //!FIXME replace to dto

	async refresh(refreshToken: string){
		const payload = this.jwtService.verify(refreshToken);

        if(!payload){
            throw new UnauthorizedException('Token is invalid');
        }

        const user = await this.usersService.findOne(payload.email);
        if(!user){
            throw new NotFoundException('User not found')
        }

        const tokens = await this.generateTokens(user);
        return tokens;
	}

    async generateTokens(user: any) {
        //!FIXME replace to dto
        const payload = {
            email: user.email,
            sub: user.id,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL,
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}
