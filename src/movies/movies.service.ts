import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  create(dto: CreateMovieDto) {
    const movie = this.movieRepo.create(dto);
    return this.movieRepo.save(movie);
  }

  findAll() {
    return this.movieRepo.find();
  }

  findOne(id: number) {
    return this.movieRepo.findOneBy({ id });
  }

  remove(id: number) {
    return this.movieRepo.delete(id);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Movie[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const skip = (page - 1) * limit;

    const [movies, total] = await this.movieRepo.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: movies,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
