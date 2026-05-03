import { PrismaService } from 'src/prisma/prisma.service.js';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

export type User = any;

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService){}

  async findOne(email: string): Promise<User | null>{
    const user = await this.prismaService.user.findFirst({where: {email}})
    return user;
  }

  async createUser(user: any){ //!FIXME register dto
    const hashedPassword = await argon2.hash(user.password);

    return this.prismaService.user.create({
      data:{
        ...user,
        password: hashedPassword
      }
    });

  }
}
