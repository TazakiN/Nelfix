import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { BucketModule } from 'src/bucket/bucket.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [FilmService],
  controllers: [FilmController],
  imports: [BucketModule, JwtModule.register({})],
})
export class FilmModule {}
