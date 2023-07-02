import { PageOptionsDto } from '@/utils/dto';
import { Status } from '@/utils/enum';
import { IsEnum, IsOptional } from 'class-validator';
import { UserEntity } from '../user.entity';

export class GetListUserDto extends PageOptionsDto {
  @IsOptional()
  orderBy?: keyof UserEntity = 'date_modified';

  @IsOptional()
  search?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsOptional()
  columns?: string;
}
