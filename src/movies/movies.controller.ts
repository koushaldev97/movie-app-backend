import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  async getMovies(
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    if (page && limit) {
      return this.moviesService.findAllPaginated(page, limit);
    }

    return this.moviesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Movie> {
    const movie = await this.moviesService.findOne(+id);
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return movie;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.moviesService.remove(+id);
    return { message: 'Movie deleted successfully' };
  }
}
