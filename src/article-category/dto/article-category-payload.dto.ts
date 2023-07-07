import { INVALID_VALUE } from '@/utils/message';
import { IsOptional, IsString, Length } from 'class-validator';
import { INVALID_CATEGORY_NAME_LENGTH } from '../constants';

export class ArticleCategoryPayloadDto {
  @IsOptional()
  @IsString({ message: INVALID_VALUE })
  @Length(2, 100, { message: INVALID_CATEGORY_NAME_LENGTH })
  article_category_name: string;

  @IsOptional()
  parent_id: string;

  @IsOptional()
  description: string;
}
