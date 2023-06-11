import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Response } from 'express';
import { EMAIL_ALREADY_EXIST } from 'src/auth/constant/message';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/utils/dto';
import { Order, Status } from 'src/utils/enum';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDTO } from './dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async addUserToDatabase(
    newUser: CreateUserDTO,
    res: Response,
    status: Status,
    message: string,
  ) {
    const userData = await this.userRepository.findOneBy({
      email: newUser.email,
    });
    if (userData) {
      return res
        .status(HttpStatus.NOT_ACCEPTABLE)
        .json({ message: EMAIL_ALREADY_EXIST });
    }

    const dataSubmit = {
      ...newUser,
      password: await argon.hash(newUser.password),
      id: uuidv4(),
      status,
    };

    await this.userRepository.save(dataSubmit);

    return res.status(HttpStatus.CREATED).json({
      message,
    });
  }
}
