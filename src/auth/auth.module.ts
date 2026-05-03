import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UsersService } from 'src/users/users.service.js';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfig } from 'src/config/jwt.config.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
    imports: [
        UsersService,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: JwtConfig,
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
