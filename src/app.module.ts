import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilmModule } from './film/film.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BucketModule } from './bucket/bucket.module';
import { AppController } from './app.controller';
import { BrowseSevice } from './browse/browse.service';
import { BrowseModule } from './browse/browse.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    FilmModule,
    UsersModule,
    BucketModule,
    BrowseModule,
  ],
  controllers: [AppController],
  providers: [BrowseSevice],
})
export class AppModule {}
