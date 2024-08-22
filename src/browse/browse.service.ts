import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrowseService {
  constructor(private prisma: PrismaService) {}

  async browseFilms(page: number, query: string) {
    const take = 8;
    const skip = (page - 1) * take;

    const [films, total] = await Promise.all([
      this.prisma.film.findMany({
        skip,
        take,
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { director: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      this.prisma.film.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { director: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    const totalPages = Math.ceil(Number(total) / take);

    return {
      films: films,
      pagination: {
        current: page,
        prev: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null,
        pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      },
    };
  }

  async getOwnedFilms(id: string, page: number) {
    const take = 8;
    const skip = (page - 1) * take;

    const [films, total] = await Promise.all([
      this.prisma.ownFilm.findMany({
        skip,
        take,
        where: { userId: id },
        include: { film: true },
      }),
      this.prisma.ownFilm.count({
        where: { userId: id },
      }),
    ]);

    const totalPages = Math.ceil(Number(total) / take);

    return {
      currentPage: 'my-list',
      films: films.map((ownFilm) => ownFilm.film),
      pagination: {
        current: page,
        prev: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null,
        pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      },
    };
  }
}
