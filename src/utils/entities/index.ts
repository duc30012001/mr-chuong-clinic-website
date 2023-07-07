import { AppointmentEntity } from '@/appointment/appointment.entity';
import { ArticleCategoryEntity } from '@/article-category/article-category.entity';
import { ArticleEntity } from '@/article/article.entity';
import { UserEntity } from '@/user/user.entity';

export const entities = [
  UserEntity,
  ArticleCategoryEntity,
  ArticleEntity,
  AppointmentEntity,
];
export * from './common';
