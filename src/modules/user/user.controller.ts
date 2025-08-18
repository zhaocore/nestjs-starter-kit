import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';

@ApiTags('/api/user')
@Controller('/api/user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    const newUser = await this.authService.register(user);

    return {
      id: newUser.id,
      token: newUser.token,
    };
  }

  @Post('login')
  async login(@Body() login: LoginDto) {
    const token = await this.authService.login(login);

    return {
      token,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CacheInterceptor)
  @Get()
  async getUsers() {
    const users = await this.userService.getAll();

    return users;
  }
}
