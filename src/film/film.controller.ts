import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Render,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmDTO } from './dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { AdminGuard } from 'src/users/guard';
import { CACHE_MANAGER, CacheInterceptor, Cache } from '@nestjs/cache-manager';
import { UserOwnFilmGuard } from './guards';

const multerOptions: MulterOptions = {
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(
        new Error('Invalid file type. Only images and videos are allowed.'),
        false,
      );
    }
  },
};

@UseInterceptors(CacheInterceptor)
@Controller('films')
export class FilmController {
  constructor(
    private filmService: FilmService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Add new film' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cover_image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async addNewFilm(
    @Body() dto: FilmDTO,
    @UploadedFiles()
    files: {
      cover_image: Express.Multer.File[];
      video: Express.Multer.File[];
    },
  ) {
    try {
      const coverImage = files.cover_image?.[0];
      const video = files.video?.[0];

      if (!video) {
        throw new Error('Video file is required');
      }

      const result = await this.filmService.addNewFilm(dto, video, coverImage);
      this.cacheManager.del('/browse'); // gabisa wildcard
      return result;
    } catch (error) {
      console.error('Error uploading files:', error.message);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all films with query' })
  findAll(@Query('q') q) {
    try {
      return this.filmService.findByQuery(q);
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find film by ID' })
  findOne(@Param('id') id: string) {
    return this.filmService.findByID(id);
  }

  @UseGuards(AdminGuard, JwtGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update film by ID' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cover_image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  update(
    @Param('id') id: string,
    @Body() dto: FilmDTO,
    @UploadedFiles()
    files: { cover_image: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    try {
      const coverImage = files?.cover_image?.[0] || null;
      const videoFile = files?.video?.[0] || null;

      this.removeCache(id);
      return this.filmService.update(id, dto, videoFile, coverImage);
    } catch (error) {
      console.error('Error updating film:', error.message);
      throw error;
    }
  }

  @UseGuards(AdminGuard, JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete film by ID' })
  remove(@Param('id') id: string) {
    this.removeCache(id);
    return this.filmService.removeFilm(id);
  }

  @UseGuards(JwtGuard)
  @Post('buy/:idUser/:idFilm')
  @ApiOperation({ summary: 'Buy film by idFilm for idUser' })
  buyFilm(@Param('idUser') idUser: string, @Param('idFilm') idFilm: string) {
    this.cacheManager.del('/browse/' + idUser); // gabisa wildcard
    return this.filmService.buyFilm(idUser, idFilm);
  }

  @Get('details/:id')
  @ApiOperation({ summary: 'Get film details page' })
  @Render('film-detail')
  details(@Param('id') id: string) {
    return this.filmService.findByID(id);
  }

  @UseGuards(UserOwnFilmGuard)
  @Get('watch/:id')
  @ApiOperation({ summary: 'Get page to watch film by ID' })
  @Render('watch')
  watch(@Param('id') id: string) {
    return this.filmService.findByID(id);
  }

  removeCache(id: string) {
    this.cacheManager.del('/films/details/' + id);
    this.cacheManager.del('/films/watch/' + id);
  }
}
