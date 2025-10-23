import {
  Controller,
  Body,
  Post,

} from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signup(@Body('gbox') gbox: string, @Body('password') password: string) {
    return this.authService.signup(gbox, password);
  }

  @Post('login')
  async login(@Body('gbox') gbox: string, @Body('password') password: string) {
    return this.authService.login(gbox, password);
  }


}
