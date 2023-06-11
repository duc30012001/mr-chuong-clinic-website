import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PageDto } from 'src/utils/dto';
import { GetListUserDTO } from './dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getListUser(
    @Query() pageOptionDto: GetListUserDTO,
  ): Promise<PageDto<UserEntity>> {
    return this.userService.getUserList(pageOptionDto);
  }
}
