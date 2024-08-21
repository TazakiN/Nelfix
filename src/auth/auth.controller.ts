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
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('register')
  @ApiOperation({ summary: 'Get page to register' })
  @Render('register')
  registerPage() {
    return {};
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  register(@Body() dto: SignUpDTO) {
    return this.authService.signup(dto);
  }

  @Get('login')
  @ApiOperation({ summary: 'Get page to login' })
  @Render('login')
  loginPage() {
    return {};
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  signin(@Body() dto: SignInDTO) {
    return this.authService.signin(dto);
  }
}
