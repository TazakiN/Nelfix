import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('register')
  @Render('register')
  registerPage() {
    return {};
  }

  @Post('register')
  register(@Body() dto: SignUpDTO) {
    return this.authService.signup(dto);
  }

  @Get('login')
  @Render('login')
  loginPage() {
    return {};
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(@Body() dto: SignInDTO) {
    return this.authService.signin(dto);
  }
}
