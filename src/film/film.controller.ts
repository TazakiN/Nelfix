import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UserOwnFilmGuard } from './guard';

const multerOptions: MulterOptions = {
  limits: { fileSize: 50 * 1024 * 1024 },
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

@Controller('films')
export class FilmController {
  constructor(private filmService: FilmService) {}

  @UseGuards(JwtGuard)
  @Post()
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
      return result;
    } catch (error) {
      console.error('Error uploading files:', error.message);
      throw error;
    }
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.filmService.findByID(id);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
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

      return this.filmService.update(id, dto, videoFile, coverImage);
    } catch (error) {
      console.error('Error updating film:', error.message);
      throw error;
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmService.removeFilm(id);
  }

  @Get('mine')
  @Render('my-list')
  myList() {
    return { currentPage: 'my-list' };
  }

  @Get('details/:id')
  @Render('film-detail')
  details(@Param('id') id: string) {
    return this.filmService.findByID(id);
  }

  @UseGuards(UserOwnFilmGuard)
  @Get('watch/:id')
  @Render('watch')
  watch(@Param('id') id: string) {
    return this.filmService.findByID(id);
  }

  @UseGuards(JwtGuard)
  @Post('buy/:idUser/:idFilm')
  buyFilm(@Param('idUser') idUser: string, @Param('idFilm') idFilm: string) {
    return this.filmService.buyFilm(idUser, idFilm);
  }
}
