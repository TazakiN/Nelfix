# NELFIX

## Description

Program ini adalah hasil dari pengerjaan tahap 3 dari Seleksi Asisten LabPro 2024. Program ini merupakan program yang menyelesaikan Spesifikasi sesuai [yang diberikan](https://docs.google.com/document/d/1v72fEU8ofI_-Dwgp8M-B5ZoE7X4XAFKik7rZX-6Pla8/edit?usp=sharing). Program ini dibuat menggunakan Framework NestJS dan menggunakan bahasa pemrograman utama TypeScript.

## Tech Stack

- [NestJS](https://nestjs.com/)
- [Handlebars](https://handlebarsjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [CloudFlare](https://www.cloudflare.com/)
- [TailwindCSS](https://tailwindcss.com/)

## Features

### F01 - Frontend

- [x] Register Page
- [x] Login Page
- [x] Browse Page
- [x] Film Details Page
- [x] My List Page

### F02 - Backend

- [x] Register
- [x] Login
- [x] Browse Film
- [x] Buy Film
- [x] Bought Film

### F03 - REST API

- [x] CRUD Film (Admin)
- [x] Auth Admin (using JWT)
- [x] RUD User (Admin)

## How to Use

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

### Installation

#### Classic Way

1. Clone repository ini

    ```bash
    git clone https://github.com/TazakiN/seleksi-3-labpro.git
    ```

2. Install dependenciies yang diperlukan

   ```bash
   yarn install
   ```

3. Buat file `.env` di root directory dari project ini dengan menyalin file `.env.example`. Isi variabel-variabel yang diperlukan.
    - Untuk mendapatkan variabel untuk R2 CloudFlare, Anda dapat mengunjungi [R2 CloudFlare](https://developers.cloudflare.com/r2/) untuk mendapatkan variabel-variabel yang diperlukan.
    - Untuk mendapatkan variabel untuk DATABASE_URL dan DIRECT_URL, Anda dapat mengunjungi [Koyeb](https://www.koyeb.com/) atau [Supabase](https://supabase.com/) untuk mendapatkan variabel-variabel yang diperlukan.
    - Untuk PORT, Anda dapat menggunakan 3000 atau port lain yang tidak digunakan. README ini mengasumsikan PORT bernilai 3000.
    - Untuk BASE_URL, Anda dapat menggunakan `http://localhost:3000` atau URL lain yang ingin Anda gunakan
    - Untuk JWT_SECRET dan ADMIN_ID, Anda dapat menggunakan string random yang diinginkan

4. Hasilkan Prisma Client dengan menjalankan perintah berikut dari file `schema.prisma` dengan menjalankan perintah berikut

    ```bash
    yarn prisma generate
    ```

5. Jalankan migrasi database dengan menjalankan perintah berikut

    ```bash
    yarn prisma migrate deploy
    ```

6. Jalankan program

   ```bash
    yarn start
    ```

7. Buka browser dan buka `http://localhost:3000`

#### Docker Way

1. Clone repository ini

    ```bash
    git clone https://github.com/TazakiN/seleksi-3-labpro.git
    ```

2. Buat file `.env` di root directory dari project ini dengan menyalin file `.env.example`. Isi variabel-variabel yang diperlukan.

3. Build Docker image

    ```bash
    docker build -t nel-fix .
    ```

4. Hasilkan Prisma Client dengan menjalankan perintah berikut dari file `schema.prisma` dengan menjalankan perintah berikut

    ```bash
    yarn prisma generate
    ```

5. Jalankan migrasi database dengan menjalankan perintah berikut

    ```bash
    yarn prisma migrate deploy
    ```

6. Run Docker image

    ```bash
    docker run -p 3000:3000 nel-fix
    ```

7. Buka browser dan buka `http://localhost:3000`

#### Deployed Version

You can access the deployed version of this program at [coming-fernande-seleksilapro-a16662b2.koyeb.app](coming-fernande-seleksilapro-a16662b2.koyeb.app)

## Design Pattern

1. **Singleton Pattern**

    Singleton Pattern digunakan untuk membuat instance dari class yang hanya bisa dibuat satu kali. Singleton Pattern digunakan pada class `PrismaService` untuk membuat instance dari Prisma Client yang hanya bisa dibuat satu kali dan hanya bertanggung jawab untuk segala operasi yang berkaitan dengan Prisma Client.

2. **Repository Pattern**

    Repository Pattern digunakan untuk memisahkan logika bisnis dari logika akses data. Repository Pattern digunakan pada class `FilmService` untuk mengakses data dari database dan melakukan operasi CRUD pada tabel `film`.

3. **Decorator Pattern**

    Decorator Pattern digunakan untuk menambahkan fitur tambahan pada class atau method tanpa mengubah struktur dari class atau method tersebut. Decorator Pattern digunakan pada class `Jwt.Guard` untuk menambahkan fitur validasi token JWT pada method yang menggunakan decorator `@UseGuards(JwtGuard)`.

## Endpoints

### Auth

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/register`                             | Mengembalikan halaman register.           |
| `POST`   | `/register`                             | Mendaftarkan user baru.                  |
| `GET`    | `/login`                                | Mengembalikan halaman login.             |
| `POST`   | `/login`                                | Melakukan login.                         |

### Browse

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/browse`                               | Mengembalikan halaman browse film.       |
| `GET`    | `/browse/:id`                           | Mengembalikan halaman film-film yang dimiliki oleh user dengan id tertentu.       |

### Bucket

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/bucket/cover-images/:key | Mengembalikan cover image dari film dengan key tertentu.|
| `GET`    | `/bucket/videos/:key`                   | Mengembalikan video dari film dengan key tertentu.|

### Users

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/users`                                | Mengembalikan semua user dengan query tertentu|
| `GET`    | `/users/:id`                            | Mengembalikan data user dengan id tertentu.|
| `PATCH`    | `/users/:id`                            | Mengubah data user dengan id tertentu.   |
| `DELETE`    | `/users/:id`                            | Menghapus data user dengan id tertentu.  |
| `GET`    | `/users/:id/detail`                    | Mengembalikan halaman detail user dengan id tertentu.|
| `POST` | `/users/:id/balance` | Menambahkan saldo user dengan id tertentu. |

### Films

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/films`                                | Menambahkan film baru.                   |
| `GET`    | `/films`                                | Mengembalikan semua film.                |
| `GET`    | `/films/:id`                            | Mengembalikan data film dengan id tertentu.|
| `PUT`    | `/films/:id`                            | Mengubah data film dengan id tertentu.   |
| `DELETE`    | `/films/:id`                            | Menghapus data film dengan id tertentu.  |
| `GET`    | `/films/details/:id`                    | Mengembalikan halaman detail film dengan id tertentu.|
| `GET`    | `/films/watch/:id`                      | Mengembalikan halaman menonton film dengan id tertentu.|
| `POST`    | `/films/buy/:idUser/:idFilm`            | idUser Membeli sebuah film  tertentu.         |

## Author

- 13522032 Tazkia Nizami
