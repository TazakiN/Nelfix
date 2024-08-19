import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';

@Module({
  providers: [BucketService],
  exports: [BucketService],
  controllers: [BucketController],
})
export class BucketModule {}
