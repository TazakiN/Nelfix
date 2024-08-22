import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { SignInDTO, SignUpDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  self() {
    return {
      status: 'success',
      message: 'Berhasil dapat self',
      data: {
        username: 'admin',
        token: this.signToken(process.env.ADMIN_ID, process.env.ADMIN_USERNAME),
      },
    };
  }
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: SignInDTO) {
    let status = true;
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.username }] },
      select: { id: true, username: true, hashed_password: true },
    });

    if (!user) {
      status = false;
    }

    const compare = await argon.verify(user.hashed_password, dto.password);
    if (!compare) {
      status = false;
    }

    const jwtToken = await this.signToken(user.id, user.username);

    return {
      status: status ? 'success' : 'error',
      message: status ? 'login' : 'username atau password salah',
      data: status
        ? {
            username: user.username,
            token: jwtToken,
          }
        : null,
    };
  }

  async signup(dto: SignUpDTO) {
    const hash = await argon.hash(dto.password);
    try {
      await this.prisma.user.create({
        data: {
          username: dto.username,
          hashed_password: hash,
          email: dto.email,
        },
      });

      const jwtToken = await this.signToken(dto.username, dto.username);
      localStorage.setItem('token', jwtToken);
      return {
        status: 'success',
        message: 'berhasil mendaftar',
        data: {
          username: dto.username,
          token: jwtToken,
        },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('username atau email sudah digunakan');
      }
      throw new ForbiddenException('gagal mendaftar');
    }
  }

  signToken(userId: string, username: string): Promise<string> {
    const payload = { sub: userId, username };
    return this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get<string>('JWT_SECRET'),
    });
  }
}
