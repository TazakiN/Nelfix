import { Get, Controller, Render } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/')
  @ApiOperation({ summary: 'Get home page' })
  @Render('index')
  root() {
    return { currentPage: 'home', message: 'Hello world!' };
  }
}
