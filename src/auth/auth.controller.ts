import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() body: { username: string; password: string }) {
    const existing = await this.authService.findByUsername(body.username);
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.authService.createUser(
      body.username,
      hashedPassword,
    );
    return this.authService.login(user); // auto-login after signup
  }
}
