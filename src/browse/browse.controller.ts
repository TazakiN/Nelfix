import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { BrowseSevice } from './browse.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('browse')
export class BrowseController {
  constructor(private browseService: BrowseSevice) {}

  @Get()
  @ApiOperation({ summary: 'Get page to Browse films by query' })
  @Render('browse')
  browseFilms(@Query('page') page: number = 1, @Query('q') query: string = '') {
    return this.browseService.browseFilms((page = 1), query);
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
