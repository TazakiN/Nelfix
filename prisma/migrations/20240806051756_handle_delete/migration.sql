-- DropForeignKey
ALTER TABLE "OwnFilm" DROP CONSTRAINT "OwnFilm_filmId_fkey";

-- DropForeignKey
ALTER TABLE "OwnFilm" DROP CONSTRAINT "OwnFilm_userId_fkey";

-- AddForeignKey
ALTER TABLE "OwnFilm" ADD CONSTRAINT "OwnFilm_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnFilm" ADD CONSTRAINT "OwnFilm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
