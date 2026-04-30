import { JwtModuleOptions } from './../../node_modules/@nestjs/jwt/dist/interfaces/jwt-module-options.interface.d';
import { verify } from 'crypto';
import {
  Secret,
  SignOptions,
  Algorithm,
} from './../../node_modules/@types/jsonwebtoken/index.d';
import { ConfigService } from '@nestjs/config';

export async function JwtConfig(configService: ConfigService): Promise<JwtModuleOptions> {
  return {
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      algorithm: 'HS256',
    },
    verifyOptions:{
        algorithms: ['HS256'],
        ignoreExpiration: false
    },
  };
}
