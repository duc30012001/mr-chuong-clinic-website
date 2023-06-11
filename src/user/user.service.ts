import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import * as _ from 'lodash';
import { EMAIL_ALREADY_EXIST } from 'src/auth/constant/message';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  ResponseDto,
  UpdateStatusDto,
} from 'src/utils/dto';
import { Order, Status } from 'src/utils/enum';
import { UPDATE_SUCCESS } from 'src/utils/message';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CREATE_USER_SUCCESS, USER_NOT_FOUND } from './constants/messages';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from './dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  public async getUserList(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .orderBy('user.date_modified', Order.DESC)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async createUser(
    createUserDto: CreateUserDto,
    authorizationHeader: string,
  ): Promise<ResponseDto> {
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = await this.jwtService.decode(token);
    const dataSubmit = {
      ...createUserDto,
      status: Status.ACTIVE,
      user_creator: decodedToken['id'],
    };
    return this.addUserToDatabase(dataSubmit, CREATE_USER_SUCCESS);
  }

  async updateStatus(
    userId: string,
    dataUpdate: UpdateStatusDto,
  ): Promise<ResponseDto> {
    await this.hasUser({ id: userId });
    await this.updateDataUserInDB(userId, dataUpdate);
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async updatePassword(
    userId: string,
    { password }: UpdatePasswordDto,
  ): Promise<ResponseDto> {
    const dataUpdate = {
      password: await argon.hash(password),
    };
    await this.hasUser({ id: userId });
    await this.updateDataUserInDB(userId, dataUpdate);
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async addUserToDatabase(newUser: CreateUserDto, message: string) {
    const userData = await this.userRepository.findOneBy({
      email: newUser.email,
    });
    if (userData) {
      throw new NotAcceptableException(EMAIL_ALREADY_EXIST);
    }

    const dataSubmit = {
      ...newUser,
      password: await argon.hash(newUser.password),
      id: uuidv4(),
    };

    await this.userRepository.save(dataSubmit);

    return new ResponseDto(message);
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (user === null) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async updateUserById(
    userId: string,
    dataUpdate: UpdateUserDto,
  ): Promise<ResponseDto> {
    if (!_.isEmpty(dataUpdate)) {
      await this.hasUser({ id: userId });
      await this.updateDataUserInDB(userId, dataUpdate);
    }
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async updateDataUserInDB(userId: string, dataUpdate) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    await queryBuilder
      .update(UserEntity)
      .set(dataUpdate)
      .where({
        id: userId,
      })
      .execute();
  }

  async hasUser(payload: { id?: string; email?: string }): Promise<boolean> {
    const user = await this.userRepository.findOneBy(payload);
    if (user === null) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return true;
  }
}
