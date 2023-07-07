import { JwtGuard } from '@/auth/guard';
import { PageDto, ResponseDto, UpdateStatusDto } from '@/utils/dto';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserDto,
  GetListUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getListUser(
    @Query() pageOptionDto: GetListUserDto,
  ): Promise<PageDto<UserEntity>> {
    return this.userService.getUserList(pageOptionDto);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  signUp(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    return this.userService.createUser(createUserDto, authorizationHeader);
  }

  @Patch('/update-status/:id')
  @HttpCode(HttpStatus.OK)
  updateStatus(@Param('id') id: string, @Body() dataUpdate: UpdateStatusDto) {
    return this.userService.updateStatus(id, dataUpdate);
  }

  @Patch('/update-password/:id')
  @HttpCode(HttpStatus.OK)
  updatePassword(
    @Param('id') id: string,
    @Body() dataUpdate: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, dataUpdate);
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  getProfileUserLoggedIn(
    @Headers('authorization') authorizationHeader: string,
  ): Promise<UserEntity> {
    return this.userService.getUserLoggedIn(authorizationHeader);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getUserById(id);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  updateUser(
    @Param('id') userId: string,
    @Body() dataUpdate: UpdateUserDto,
  ): Promise<ResponseDto> {
    return this.userService.updateUserById(userId, dataUpdate);
  }
}
