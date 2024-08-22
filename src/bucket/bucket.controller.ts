import { Controller, Get, Res, Param, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { BucketService } from './bucket.service';
import { StreamableFile } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get('cover-images/:key')
  @ApiOperation({ summary: 'Get cover image by key' })
  async getCoverImageObj(
    @Param('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const folder = 'cover-images';
    const file = await this.bucketService.getObject(folder, key);

    res.set({
      'Content-Type': file.options.type,
      'Content-Disposition': `inline; filename="${key}"`,
    });

    return file;
  }

  @Get('videos/:key')
  @ApiOperation({ summary: 'Get video by key' })
  async getVideoObj(
    @Param('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const folder = 'videos';
    const file = await this.bucketService.getObject(folder, key);

    res.set({
      'Content-Type': file.options.type,
      'Content-Disposition': `inline; filename="${key}"`,
    });

    return file;
  }
}
