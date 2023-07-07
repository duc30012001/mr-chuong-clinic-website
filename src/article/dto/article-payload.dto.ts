import { INVALID_VALUE } from '@/utils/message';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { INVALID_NAME_LENGTH } from '../constants';

export class ArticlePayloadDto {
  @IsOptional()
  @IsString({ message: INVALID_VALUE })
  @Length(2, 100, { message: INVALID_NAME_LENGTH })
  article_title: string;

  @IsString()
  content: string;

  @IsUUID()
  article_category_id: string;

  @IsString()
  description: string;
}
