import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class FilmDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  director: string;

  @Type(() => Number)
  @IsInt()
  release_year: number;

  @IsString({ each: true })
  genre: string[];

  @Type(() => Number)
  @IsInt()
  price: number;

  @Type(() => Number)
  @IsInt()
  duration: number;
}
