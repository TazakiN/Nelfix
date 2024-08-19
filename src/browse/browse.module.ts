import { Module } from '@nestjs/common';
import { BrowseController } from './browse.controller';
import { BrowseSevice } from './browse.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BrowseController],
  providers: [BrowseSevice],
})
export class BrowseModule {}
