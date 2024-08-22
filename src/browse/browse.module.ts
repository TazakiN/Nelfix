import { Module } from '@nestjs/common';
import { BrowseController } from './browse.controller';
import { BrowseService } from './browse.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BrowseController],
  providers: [BrowseService],
})
export class BrowseModule {}
