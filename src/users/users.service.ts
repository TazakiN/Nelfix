import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async deleteUser(id: string) {
    const user = await this.prisma.getUserByID(id);
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });

      return {
        status: 'success',
        message: 'User deleted successfully',
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to delete user: ${error.message}`,
        data,
      };
    }
  }

  async addBalance(id: string, increment: number) {
    try {
      const currentBalance = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          balance: true,
        },
      });

      const updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          balance: currentBalance.balance + increment,
        },
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
        },
      });

      return {
        status: 'success',
        message: 'Balance updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to update balance: ${error.message}`,
        data: null,
      };
    }
  }

  async searchUser(q: string) {
    try {
      const whereClause: Prisma.UserWhereInput = q
        ? {
            username: { contains: q, mode: 'insensitive' },
          }
        : {};
      const data = await this.prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          username: true,
          email: true,
          balance: true,
        },
      });

      return {
        status: 'success',
        message: data.length ? ' Users found' : 'No users found',
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to search users: ${error.message}`,
        data: [],
      };
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, username: true, email: true, balance: true },
      });

      return {
        status: 'success',
        message: 'berhasil mendapatkan data',
        data: user,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'gagal mendapatkan data',
        data: null,
      };
    }
  }

  async updateUser(id: string, updateUserDTO: UpdateUserDTO) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDTO,
        select: { id: true, username: true, email: true, balance: true },
      });

      return {
        status: 'success',
        message: 'User information updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to update user: ${error.message}`,
        data: null,
      };
    }
  }
}
