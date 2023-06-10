import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Response } from 'express';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import {
  EMAIL_ALREADY_EXIST,
  LOGIN_SUCCESS,
  SIGN_UP_SUCCESS,
  USER_NOT_FOUND,
} from './constant/message';
import { LoginDTO } from './dto';
import { SignUpDTO } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO, res: Response): Promise<Response> {
    const userList = await this.userRepository.find({
      where: { email: loginDTO.email },
    });
    if (userList.length === 0) {
      this.throwErrorNotFound();
    }
    const dataUser = userList[0];
    const isPasswordMatched = await argon.verify(
      dataUser.password,
      loginDTO.password,
    );

    if (!isPasswordMatched) {
      this.throwErrorNotFound();
    }

    const token = await this.generateToken(loginDTO.email, dataUser.id);

    console.log(userList);
    return res.status(HttpStatus.OK).json({
      message: LOGIN_SUCCESS,
      ...token,
    });
  }

  async signUp(signUpDTO: SignUpDTO, res: Response): Promise<Response> {
    const userList = await this.userRepository.find({
      where: {
        email: signUpDTO.email,
      },
    });
    if (userList.length > 0) {
      return res
        .status(HttpStatus.NOT_ACCEPTABLE)
        .json({ message: EMAIL_ALREADY_EXIST });
    }

    const dataSubmit = {
      ...signUpDTO,
      password: await argon.hash(signUpDTO.password),
    };

    await this.userRepository.save(dataSubmit);

    return res.status(HttpStatus.CREATED).json({
      message: SIGN_UP_SUCCESS,
    });
  }

  throwErrorNotFound() {
    throw new NotFoundException(USER_NOT_FOUND);
  }

  async generateToken(
    email: string,
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
