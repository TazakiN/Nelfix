import { Get, Controller, Render, UseInterceptors } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  @Get('/')
  @ApiOperation({ summary: 'Get home page' })
  @Render('index')
  root() {
    // console.log('Rendering home page');
    return { currentPage: 'home', message: 'Hello world!' };
  }
}
