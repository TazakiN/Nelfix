import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const hashedPasswordAdmin = await argon.hash('admin123');
  const defaultVideoURL =
    '/bucket/videos/Cerita masa muda kakek marcow incu bag_ng.mp4';

  const adminUser = await prisma.user.create({
    data: {
      id: process.env.ADMIN_ID,
      username: 'admin',
      email: 'admin@gmail.com',
      hashed_password: hashedPasswordAdmin,
      balance: 1000,
    },
  });

  console.log(
    `Created admin user: ${adminUser.username} with email: ${adminUser.email}`,
  );

  const hashedPasswordUser1 = await argon.hash('user123');
  const hashedPasswordUser2 = await argon.hash('user456');

  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'user1@gmail.com',
      hashed_password: hashedPasswordUser1,
      balance: 500,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'user2@gmail.com',
      hashed_password: hashedPasswordUser2,
      balance: 750,
    },
  });

  console.log(`Created users: ${user1.username}, ${user2.username}`);

  const actionGenre = await prisma.genre.create({
    data: {
      name: 'Action',
    },
  });

  const comedyGenre = await prisma.genre.create({
    data: {
      name: 'Comedy',
    },
  });

  const dramaGenre = await prisma.genre.create({
    data: {
      name: 'Drama',
    },
  });

  console.log(
    `Created genres: ${actionGenre.name}, ${comedyGenre.name}, ${dramaGenre.name}`,
  );

  const film1 = await prisma.film.create({
    data: {
      title: 'Inception',
      description: 'A mind-bending thriller by Christopher Nolan.',
      director: 'Christopher Nolan',
      release_year: 2010,
      price: 40,
      duration: 148,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/inception.jpg',
    },
  });

  const film2 = await prisma.film.create({
    data: {
      title: 'The Matrix',
      description: 'A revolutionary sci-fi classic directed by the Wachowskis.',
      director: 'The Wachowskis',
      release_year: 1999,
      price: 30,
      duration: 136,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/matrix.jpeg',
    },
  });

  const film3 = await prisma.film.create({
    data: {
      title: 'The Godfather',
      description: 'The story of a powerful Italian-American crime family.',
      director: 'Francis Ford Coppola',
      release_year: 1972,
      price: 25,
      duration: 175,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/the godfather.png',
    },
  });

  const film4 = await prisma.film.create({
    data: {
      title: 'Superbad',
      description: 'A hilarious comedy about two high school friends.',
      director: 'Greg Mottola',
      release_year: 2007,
      price: 20,
      duration: 113,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/superbad.jpg',
    },
  });

  console.log(
    `Created films: ${film1.title}, ${film2.title}, ${film3.title}, ${film4.title}`,
  );

  await prisma.ownFilm.create({
    data: {
      userId: adminUser.id,
      filmId: film1.id,
    },
  });

  await prisma.ownFilm.create({
    data: {
      userId: adminUser.id,
      filmId: film2.id,
    },
  });

  await prisma.ownFilm.create({
    data: {
      userId: adminUser.id,
      filmId: film3.id,
    },
  });

  await prisma.ownFilm.create({
    data: {
      userId: adminUser.id,
      filmId: film4.id,
    },
  });

  console.log(`Assigned films to admin user: ${adminUser.username}`);

  await prisma.ownFilm.create({
    data: {
      userId: user1.id,
      filmId: film1.id,
    },
  });

  await prisma.ownFilm.create({
    data: {
      userId: user1.id,
      filmId: film4.id,
    },
  });

  console.log(`Assigned films to user: ${user1.username}`);

  await prisma.ownFilm.create({
    data: {
      userId: user2.id,
      filmId: film2.id,
    },
  });

  await prisma.ownFilm.create({
    data: {
      userId: user2.id,
      filmId: film3.id,
    },
  });

  console.log(`Assigned films to user: ${user2.username}`);

  await prisma.filmGenre.create({
    data: {
      filmId: film1.id,
      genreId: actionGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film2.id,
      genreId: actionGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film3.id,
      genreId: dramaGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film4.id,
      genreId: comedyGenre.id,
    },
  });

  console.log(`Linked films to genres.`);

  const film5 = await prisma.film.create({
    data: {
      title: 'Guardians of the Galaxy',
      description:
        'A team of intergalactic criminals must pull together to stop a fanatical warrior.',
      director: 'James Gunn',
      release_year: 2014,
      price: 35,
      duration: 121,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/guardian of the galaxy.png',
    },
  });

  const film6 = await prisma.film.create({
    data: {
      title: 'Fight Club',
      description:
        'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.',
      director: 'David Fincher',
      release_year: 1999,
      price: 30,
      duration: 139,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/fight club.jpg',
    },
  });

  console.log(`Created multi-genre films: ${film5.title}, ${film6.title}`);

  await prisma.filmGenre.create({
    data: {
      filmId: film5.id,
      genreId: actionGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film5.id,
      genreId: comedyGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film6.id,
      genreId: dramaGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film6.id,
      genreId: actionGenre.id,
    },
  });

  console.log(`Assigned multi-genres to films.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
