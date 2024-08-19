import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { SelfService } from './user.service';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('self')
export class SelfController {
  constructor(private userService: SelfService) {}

  @Get()
  self(@Req() req: Request) {
    const user = req.user;
    return this.userService.self(user);
  }
}
