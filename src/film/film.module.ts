import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { BucketModule } from 'src/bucket/bucket.module';

@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports: [BucketModule],
})
export class FilmModule {}
