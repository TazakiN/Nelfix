import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SelfService {
  constructor(private authService: AuthService) {}

  async self(user: any) {
    const token = await this.authService.signToken(user.id, user.username);

    return {
      status: 'success',
      message: 'berhasil mendapatkan data',
      data: {
        username: 'admin',
        token: token,
      },
    };
  }
}
