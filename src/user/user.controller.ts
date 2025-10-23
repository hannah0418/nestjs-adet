import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/guard';
import { AuthService } from '../auth/auth.service';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(AuthGuard)
  @Post('user')
  async create(@Body('gbox') gbox: string, @Body('password') password: string) {
    return this.authService.signup(gbox, password);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async findAll() {
    return this.userService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  async findOne(@Param('id') id: number) {
    return this.userService.getOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete('user/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @Patch('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body('gbox') gbox: string,
    @Body('password') password: string,
  ) {
    return this.userService.update(id, gbox, password);
  }
}
