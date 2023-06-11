import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Response } from 'express';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Status } from 'src/utils/enum';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import {
  LOGIN_SUCCESS,
  SIGN_UP_SUCCESS,
  USER_NOT_ACTIVE,
  USER_NOT_FOUND,
} from './constant/message';
import { LoginDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(loginDTO: LoginDTO, res: Response): Promise<Response> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.addSelect('user.password').where({
      email: loginDTO.email,
    });

    const { entities: userList } = await queryBuilder.getRawAndEntities();
    if (userList.length === 0) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const dataUser = userList[0];
    const isPasswordMatched = await argon.verify(
      dataUser.password,
      loginDTO.password,
    );

    if (!isPasswordMatched) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (dataUser.status !== Status.ACTIVE) {
      throw new NotAcceptableException(USER_NOT_ACTIVE);
    }

    const token = await this.generateToken(loginDTO.email, dataUser.id);

    return res.status(HttpStatus.OK).json({
      message: LOGIN_SUCCESS,
      ...token,
    });
  }

  async signUp(signUpDTO: CreateUserDTO, res: Response): Promise<Response> {
    return this.userService.addUserToDatabase(
      signUpDTO,
      res,
      Status.PENDING,
      SIGN_UP_SUCCESS,
    );
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
