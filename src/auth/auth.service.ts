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
import { ResponseDto } from 'src/utils/dto';
import { Status } from 'src/utils/enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  LOGIN_SUCCESS,
  SIGN_UP_SUCCESS,
  USER_NOT_ACTIVE,
  USER_NOT_FOUND,
} from './constant/message';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto, res: Response): Promise<Response> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.addSelect('user.password').where({
      email: loginDto.email,
    });

    const { entities: userList } = await queryBuilder.getRawAndEntities();
    if (userList.length === 0) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const dataUser = userList[0];
    const isPasswordMatched = await argon.verify(
      dataUser.password,
      loginDto.password,
    );

    if (!isPasswordMatched) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (dataUser.status !== Status.ACTIVE) {
      throw new NotAcceptableException(USER_NOT_ACTIVE);
    }

    const token = await this.generateToken(loginDto.email, dataUser.id);

    return res.status(HttpStatus.OK).json({
      message: LOGIN_SUCCESS,
      ...token,
    });
  }

  async signUp(signUpDto: CreateUserDto): Promise<ResponseDto> {
    const dataUser = {
      ...signUpDto,
      status: Status.PENDING,
    };
    return this.userService.addUserToDatabase(dataUser, SIGN_UP_SUCCESS);
  }

  async generateToken(
    email: string,
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      id: userId,
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
