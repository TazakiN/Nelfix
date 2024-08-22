import {
  Controller,
  Get,
  Param,
  Query,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { BrowseService } from './browse.service';
import { ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

UseInterceptors(CacheInterceptor);
@Controller('browse')
@UseInterceptors(CacheInterceptor)
export class BrowseController {
  constructor(private browseService: BrowseService) {}

  @Get()
  @ApiOperation({ summary: 'Get page to Browse films by query' })
  @Render('browse')
  browseFilms(@Query('page') page: number = 1, @Query('q') query: string = '') {
    return this.browseService.browseFilms(page, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get film owned page by user ID' })
  @Render('owned-films')
  async getOwnedFilms(
    @Param('id') id: string,
    @Query('page') page: number = 1,
  ) {
    return this.browseService.getOwnedFilms(id, page);
  }
}
