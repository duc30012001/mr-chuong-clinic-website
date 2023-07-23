import { JwtStrategy } from '@/auth/strategy';
import { entities } from '@/utils/entities';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCategoryService } from './article-category.service';
import {
  ArticleCategoryController,
  ArticleCategoryPublicController,
} from './controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities), JwtModule.register({})],
  controllers: [ArticleCategoryController, ArticleCategoryPublicController],
  providers: [ArticleCategoryService, JwtStrategy],
})
export class ArticleCategoryModule {}
