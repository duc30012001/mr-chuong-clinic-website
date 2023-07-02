import { EMAIL_ALREADY_EXIST } from '@/auth/constant/message';
import {
  PageDto,
  PagePaginationDto,
  ResponseDto,
  UpdateStatusDto,
} from '@/utils/dto';
import { Status } from '@/utils/enum';
import { UPDATE_SUCCESS } from '@/utils/message';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CREATE_USER_SUCCESS, USER_NOT_FOUND } from './constants/messages';
import {
  CreateUserDto,
  GetListUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  public async getUserList(
    getListUserDto: GetListUserDto,
  ): Promise<PageDto<UserEntity>> {
    const { search, status, skip, take, order, orderBy, columns } =
      getListUserDto;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (columns && columns !== '*' && columns !== 'password') {
      const selectedColumns = columns
        .split(',')
        .filter((item) => item !== 'password');
      queryBuilder.select(selectedColumns.map((column) => `user.${column}`));
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (search) {
      const lowercaseSearch = search.toLowerCase();
      queryBuilder.andWhere('LOWER(user.email) LIKE :email', {
        email: `%${lowercaseSearch}%`,
      });
    }

    if (!columns || columns.includes('user_creator')) {
      queryBuilder.leftJoinAndSelect('user.creator', 'creator');
    }

    queryBuilder.orderBy(`user.${orderBy}`, order).skip(skip).take(take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PagePaginationDto({
      itemCount,
      pageOptionsDto: getListUserDto,
    });

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

  async getUserLoggedIn(authorizationHeader: string): Promise<UserEntity> {
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = await this.jwtService.decode(token);
    console.log('decodedToken:', decodedToken);
    const user = await this.userRepository.findOneBy({
      id: decodedToken['id'],
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
