import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FilmModule } from './film/film.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BucketModule } from './bucket/bucket.module';
import { AppController } from './app.controller';
import { BrowseService } from './browse/browse.service';
import { BrowseModule } from './browse/browse.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      no_ready_check: true,
    }),
    AuthModule,
    PrismaModule,
    FilmModule,
    UsersModule,
    BucketModule,
    BrowseModule,
  ],
  controllers: [AppController],
  providers: [BrowseService],
})
export class AppModule {}
