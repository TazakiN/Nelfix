import { Injectable } from '@nestjs/common';
import { FilmDTO } from './dto/film.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BucketService } from 'src/bucket/bucket.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

@Injectable()
export class FilmService {
  constructor(
    private prisma: PrismaService,
    private bucketService: BucketService,
    private configService: ConfigService,
  ) {}

  async addNewFilm(
    data: FilmDTO,
    videoFile: Express.Multer.File,
    coverImage?: Express.Multer.File,
  ) {
    try {
      const coverImageName = `cover-images/${coverImage.originalname}`;
      const videoFileName = `videos/${videoFile.originalname}`;

      let coverImageUrl = null;
      if (coverImage) {
        coverImageUrl = await this.bucketService.putObject(
          coverImageName,
          coverImage.buffer,
          coverImage.mimetype,
        );
      }

      const videoUrl = await this.bucketService.putObject(
        videoFileName,
        videoFile.buffer,
        videoFile.mimetype,
      );

      await this.addFilmToDB(
        data,
        this.configService.get('BASE_URL') + '/bucket/' + videoUrl,
        coverImageUrl
          ? this.configService.get('BASE_URL') + '/bucket/' + coverImageUrl
          : null,
      );

      return {
        status: 'success',
        message: 'Film Berhasil Ditambahkan',
      };
    } catch (error) {
      console.error('Error creating film:', error.message);
      throw error;
    }
  }

  async findByQuery(q: string) {
    try {
      const whereClause: Prisma.FilmWhereInput = q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { director: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {};

      const films = await this.prisma.film.findMany({
        where: whereClause,
        include: {
          FilmGenre: {
            include: {
              genre: true,
            },
          },
        },
      });

      if (films.length === 0) {
        return {
          status: 'success',
          message: q
            ? 'Tidak ada film yang cocok dengan query.'
            : 'Tidak ada film dalam database.',
          data: [],
        };
      }

      const data = films.map((film) => {
        const genres = film.FilmGenre.map((fg) => fg.genre.name);
        return {
          id: film.id,
          title: film.title,
          director: film.director,
          release_year: film.release_year,
          genre: genres,
          price: film.price,
          duration: film.duration,
          cover_image_url: film.cover_image_url,
          created_at: film.created_at.toISOString(),
          updated_at: film.updated_at.toISOString(),
        };
      });

      return {
        status: 'success',
        message: 'Berhasil GET films',
        data: data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to search films: ${error.message}`,
        data: null,
      };
    }
  }

  async findByID(id: string) {
    try {
      const filmData = await this.prisma.film.findFirst({
        where: { id },
        include: {
          FilmGenre: {
            include: {
              genre: true,
            },
          },
        },
      });

      if (!filmData) {
        throw new Error('Film Tidak Ditemukan');
      }

      const genres = filmData.FilmGenre.map((fg) => fg.genre.name);

      const data = {
        id: filmData.id,
        title: filmData.title,
        description: filmData.description,
        director: filmData.director,
        release_year: filmData.release_year,
        genre: genres,
        price: filmData.price,
        duration: filmData.duration,
        cover_image_url: filmData.cover_image_url,
        video_url: filmData.video_url,
        created_at: filmData.created_at.toISOString(),
        updated_at: filmData.updated_at.toISOString(),
      };

      return {
        status: 'success',
        message: 'Film Berhasil Ditemukan',
        data: data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async update(
    id: string,
    data: FilmDTO,
    videoFile?: Express.Multer.File,
    coverImage?: Express.Multer.File,
  ) {
    // Mulai transaksi untuk memastikan konsistensi
    return this.prisma.$transaction(async (prisma) => {
      const existingFilm = await prisma.film.findFirst({
        where: { id },
        include: {
          FilmGenre: true,
        },
      });

      if (!existingFilm) {
        throw new Error('Film tidak ditemukan');
      }

      // Update cover image jika diperlukan
      if (coverImage) {
        if (existingFilm.cover_image_url) {
          await this.bucketService.deleteObject(
            'cover-images',
            existingFilm.cover_image_url,
          );
        }
        const newCoverImageName = `cover-images/${coverImage.originalname}`;
        const newCoverImageUrl = await this.bucketService.putObject(
          newCoverImageName,
          coverImage.buffer,
          coverImage.mimetype,
        );

        await prisma.film.update({
          where: { id },
          data: {
            cover_image_url:
              this.configService.get('BASE_URL') +
              '/bucket/' +
              newCoverImageUrl,
          },
        });
      }

      // Update video file jika diperlukan
      if (videoFile) {
        if (existingFilm.video_url) {
          await this.bucketService.deleteObject(
            'videos',
            existingFilm.video_url,
          );
        }
        const newVideoFileName = `videos/${videoFile.originalname}`;
        const newVideoUrl = await this.bucketService.putObject(
          newVideoFileName,
          videoFile.buffer,
          videoFile.mimetype,
        );

        await prisma.film.update({
          where: { id },
          data: {
            video_url: newVideoUrl,
            duration: data.duration,
          },
        });
      }

      // Update genres
      const genresArray: string[] = data.genre;

      // Ambil genre yang ada
      const existingGenres = existingFilm.FilmGenre.map((fg) => fg.genreId);

      // Cari genre baru yang perlu ditambahkan
      const newGenres = await Promise.all(
        genresArray.map(async (genreName) => {
          let genre = await prisma.genre.findFirst({
            where: { name: genreName },
          });

          if (!genre) {
            genre = await prisma.genre.create({
              data: { name: genreName },
            });
          }
          return genre;
        }),
      );

      const newGenreIds = newGenres.map((genre) => genre.id);

      // Hapus genre yang tidak ada di DTO baru
      await prisma.filmGenre.deleteMany({
        where: {
          filmId: id,
          genreId: { notIn: newGenreIds },
        },
      });

      // Tambahkan genre baru
      const genresToAdd = newGenreIds.filter(
        (id) => !existingGenres.includes(id),
      );

      await prisma.filmGenre.createMany({
        data: genresToAdd.map((genreId) => ({
          filmId: id,
          genreId: genreId,
        })),
      });

      // Update data film
      const updatedFilm = await prisma.film.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          director: data.director,
          release_year: data.release_year,
          price: data.price,
        },
        include: {
          FilmGenre: {
            include: {
              genre: true,
            },
          },
        },
      });

      return {
        status: 'success',
        message: 'Film Berhasil Diupdate',
        data: {
          id: updatedFilm.id,
          title: updatedFilm.title,
          description: updatedFilm.description,
          director: updatedFilm.director,
          release_year: updatedFilm.release_year,
          genre: updatedFilm.FilmGenre.map((fg) => fg.genre.name),
          price: updatedFilm.price,
          duration: updatedFilm.duration,
          cover_image_url: updatedFilm.cover_image_url,
          video_url: updatedFilm.video_url,
          created_at: updatedFilm.created_at.toISOString(),
          updated_at: updatedFilm.updated_at.toISOString(),
        },
      };
    });
  }

  async removeFilm(id: string) {
    try {
      const film = await this.prisma.film.findFirst({
        where: { id },
        include: {
          FilmGenre: {
            include: {
              genre: true,
            },
          },
        },
      });

      if (!film) {
        throw new Error('Film Tidak Ditemukan');
      }

      await this.prisma.filmGenre.deleteMany({
        where: { filmId: id },
      });

      const genres = film.FilmGenre.map((fg) => fg.genre.name).join(' ');

      const imageUrl = film.cover_image_url;
      const videoUrl = film.video_url;

      if (imageUrl) {
        await this.bucketService.deleteObject('cover-images', imageUrl);
      }

      await this.bucketService.deleteObject('videos', videoUrl);

      await this.prisma.film.delete({ where: { id } });

      return {
        status: 'success',
        message: 'Film Berhasil Dihapus',
        data: {
          id: film.id,
          title: film.title,
          description: film.description,
          director: film.director,
          release_year: film.release_year,
          genre: genres,
          video_url: film.video_url,
          created_at: film.created_at.toISOString(),
          updated_at: film.updated_at.toISOString(),
        },
      };
    } catch (error) {
      console.error('Error removing film:', error.message);
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async addFilmToDB(data: FilmDTO, videoUrl: string, coverImageUrl?: string) {
    try {
      const genresArray: string[] = data.genre;

      const genrePromises = genresArray.map(async (genreName) => {
        const existingGenres = await this.prisma.genre.findMany({
          where: { name: genreName },
        });

        let genre =
          existingGenres.length > 0
            ? existingGenres[0]
            : await this.prisma.genre.create({
                data: { name: genreName },
              });

        return genre;
      });

      const genres = await Promise.all(genrePromises);

      await this.prisma.film.create({
        data: {
          title: data.title,
          description: data.description,
          director: data.director,
          release_year: data.release_year,
          price: data.price,
          duration: data.duration,
          video_url: videoUrl,
          cover_image_url: coverImageUrl,
          FilmGenre: {
            create: genres.map((genre) => ({
              genreId: genre.id,
            })),
          },
        },
      });
    } catch (error) {
      console.error('Error saving film to database:', error.message);
      throw error;
    }
  }

  async buyFilm(idUser: string, idFilm: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: idUser },
        include: {
          OwnFilm: true,
        },
      });

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      const film = await this.prisma.film.findUnique({
        where: { id: idFilm },
      });

      if (!film) {
        throw new Error('Film tidak ditemukan');
      }

      const userFilm = user.OwnFilm.find((f) => f.filmId === idFilm);

      if (userFilm) {
        throw new Error('Film sudah dibeli');
      }

      await this.prisma.user.update({
        where: { id: idUser },
        data: {
          balance: {
            decrement: film.price,
          },
          OwnFilm: {
            create: {
              filmId: idFilm,
            },
          },
        },
      });

      return {
        status: 'success',
        message: 'Film berhasil dibeli',
        data: {
          id: film.id,
          title: film.title,
          description: film.description,
          director: film.director,
          release_year: film.release_year,
          price: film.price,
          duration: film.duration,
          cover_image_url: film.cover_image_url,
          video_url: film.video_url,
          created_at: film.created_at.toISOString(),
          updated_at: film.updated_at.toISOString(),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }
}
