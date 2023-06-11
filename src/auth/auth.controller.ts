import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDTO: LoginDTO, @Res() res: Response) {
    return this.authService.login(loginDTO, res);
  }

  @Post('/sign-up')
  signUp(@Body() signUpDTO: CreateUserDTO, @Res() res: Response) {
    return this.authService.signUp(signUpDTO, res);
  }
}
