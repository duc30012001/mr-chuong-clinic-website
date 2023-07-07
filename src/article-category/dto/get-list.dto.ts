import { PageOptionsDto } from '@/utils/dto';
import { Status } from '@/utils/enum';
import { IsEnum, IsOptional } from 'class-validator';
import { ArticleCategoryEntity } from '../article-category.entity';

export class GetListArticleCategoryDto extends PageOptionsDto {
  @IsOptional()
  orderBy?: keyof ArticleCategoryEntity = 'date_modified';

  @IsOptional()
  search?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsOptional()
  columns?: string;
}
