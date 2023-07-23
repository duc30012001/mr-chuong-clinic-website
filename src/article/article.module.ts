import { JwtStrategy } from '@/auth/strategy';
import { entities } from '@/utils/entities';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleController, ArticlePublicController } from './controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities), JwtModule.register({})],
  controllers: [ArticleController, ArticlePublicController],
  providers: [ArticleService, JwtStrategy],
})
export class ArticleModule {}
