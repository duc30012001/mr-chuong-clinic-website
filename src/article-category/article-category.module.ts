import { JwtStrategy } from '@/auth/strategy';
import { entities } from '@/utils/entities';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCategoryController } from './article-category.controller';
import { ArticleCategoryService } from './article-category.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities), JwtModule.register({})],
  controllers: [ArticleCategoryController],
  providers: [ArticleCategoryService, JwtStrategy],
})
export class ArticleCategoryModule {}
