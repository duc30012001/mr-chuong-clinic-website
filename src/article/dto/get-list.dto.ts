import { PageOptionsDto } from '@/utils/dto';
import { Status } from '@/utils/enum';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ArticleEntity } from '../article.entity';

export class GetListArticleDto extends PageOptionsDto {
  @IsOptional()
  orderBy?: keyof ArticleEntity = 'date_modified';

  @IsOptional()
  search?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsOptional()
  columns?: string;

  @IsOptional()
  @IsUUID()
  article_category_id?: string;
}

export class GetListArticlePublicDto extends PageOptionsDto {
  @IsOptional()
  orderBy?: keyof ArticleEntity = 'date_modified';

  @IsOptional()
  search?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ACTIVE;

  @IsOptional()
  columns?: string;

  @IsOptional()
  @IsUUID()
  article_category_id?: string;
}
