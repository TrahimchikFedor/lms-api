import { PrismaService } from '../prisma/prisma.service.js';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from '../generated/prisma/client.js';
import { RegisterUserDto } from '../auth/dto/user.dto.js';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async findOne(email: string): Promise<User | null> {
        const user = await this.prismaService.user.findFirst({
            where: { email },
        });
        return user;
    }

    async createUser(user: RegisterUserDto): Promise<User> {
        const hashedPassword = await argon2.hash(user.password);

        return this.prismaService.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });
    }
}
