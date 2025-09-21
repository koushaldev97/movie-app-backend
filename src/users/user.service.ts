import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }

  async create(username: string, hashedPassword: string) {
    const user = this.userRepo.create({ username, password: hashedPassword });
    return this.userRepo.save(user);
  }
}
