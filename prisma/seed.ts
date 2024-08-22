import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const hashedPasswordAdmin = await argon.hash(process.env.ADMIN_PASSWORD);
  const defaultVideoURL =
    '/bucket/videos/Cerita masa muda kakek marcow incu bag_ng.mp4';

  const adminUser = await prisma.user.create({
    data: {
      id: process.env.ADMIN_ID,
      username: process.env.ADMIN_USERNAME,
      email: 'admin@gmail.com',
      hashed_password: hashedPasswordAdmin,
      balance: 1000,
    },
  });

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

  // Existing genres
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

  // New genres
  const thrillerGenre = await prisma.genre.create({
    data: {
      name: 'Thriller',
    },
  });

  const sciFiGenre = await prisma.genre.create({
    data: {
      name: 'Sci-Fi',
    },
  });

  // Existing films
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

  // Additional films
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

  // Additional films
  const film7 = await prisma.film.create({
    data: {
      title: 'The Shawshank Redemption',
      description:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      director: 'Frank Darabont',
      release_year: 1994,
      price: 28,
      duration: 142,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/shawshank.jpg',
    },
  });

  const film8 = await prisma.film.create({
    data: {
      title: 'Pulp Fiction',
      description:
        "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      director: 'Quentin Tarantino',
      release_year: 1994,
      price: 30,
      duration: 154,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/pulp fiction.jpeg',
    },
  });

  const film9 = await prisma.film.create({
    data: {
      title: 'Interstellar',
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      director: 'Christopher Nolan',
      release_year: 2014,
      price: 40,
      duration: 169,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/interstellar.jpeg',
    },
  });

  const film10 = await prisma.film.create({
    data: {
      title: 'The Dark Knight',
      description:
        'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
      director: 'Christopher Nolan',
      release_year: 2008,
      price: 35,
      duration: 152,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/dark_knight.jpg',
    },
  });

  const film11 = await prisma.film.create({
    data: {
      title: 'The Departed',
      description:
        'An undercover cop and a mole in the police force try to identify each other while infiltrating an Irish gang in Boston.',
      director: 'Martin Scorsese',
      release_year: 2006,
      price: 30,
      duration: 151,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/departed.jpg',
    },
  });

  const film12 = await prisma.film.create({
    data: {
      title: 'Gladiator',
      description:
        'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
      director: 'Ridley Scott',
      release_year: 2000,
      price: 25,
      duration: 155,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/gladiator.jpg',
    },
  });

  const film13 = await prisma.film.create({
    data: {
      title: 'The Lion King',
      description: 'Lion cub and future king Simba searches for his identity.',
      director: 'Roger Allers, Rob Minkoff',
      release_year: 1994,
      price: 20,
      duration: 88,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/lion_king.jpg',
    },
  });

  const film14 = await prisma.film.create({
    data: {
      title: 'Joker',
      description:
        'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society.',
      director: 'Todd Phillips',
      release_year: 2019,
      price: 28,
      duration: 122,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/joker.jpg',
    },
  });

  const film15 = await prisma.film.create({
    data: {
      title: 'Parasite',
      description:
        'A poor family schemes to become employed by a wealthy family and infiltrate their household.',
      director: 'Bong Joon-ho',
      release_year: 2019,
      price: 30,
      duration: 132,
      video_url: defaultVideoURL,
      cover_image_url: '/bucket/cover-images/parasite.jpeg',
    },
  });

  // Film-Genre associations
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

  await prisma.filmGenre.create({
    data: {
      filmId: film7.id,
      genreId: dramaGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film8.id,
      genreId: thrillerGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film9.id,
      genreId: sciFiGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film10.id,
      genreId: actionGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film11.id,
      genreId: thrillerGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film12.id,
      genreId: actionGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film13.id,
      genreId: dramaGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film14.id,
      genreId: thrillerGenre.id,
    },
  });

  await prisma.filmGenre.create({
    data: {
      filmId: film15.id,
      genreId: dramaGenre.id,
    },
  });

  // User-Film ownership
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

  await prisma.ownFilm.create({
    data: {
      userId: adminUser.id,
      filmId: film5.id,
    },
  });

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

  await prisma.ownFilm.create({
    data: {
      userId: user1.id,
      filmId: film7.id,
    },
  });

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

  await prisma.ownFilm.create({
    data: {
      userId: user2.id,
      filmId: film6.id,
    },
  });

  await prisma.ownFilm.create({
    data: {
      userId: user2.id,
      filmId: film14.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
