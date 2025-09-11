import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(userId: string, data: UpdateUserDto) {
    const findUser = await this.getProfile(userId);

    if (!findUser) {
      throw new HttpException('User not found', 404);
    }

    if (data.email && data.email !== findUser.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId },
        },
      });

      if (emailExists) {
        throw new HttpException('Email already in use', 400);
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
