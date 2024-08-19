import { Controller, Get, Res, Param, Render } from '@nestjs/common';
import { Response } from 'express';
import { BucketService } from './bucket.service';
import { StreamableFile } from '@nestjs/common';

@Controller('bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get('cover-images/:key')
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

  @Get()
  @Render('test')
  root() {
    return { message: 'Hello world!' };
  }
}
