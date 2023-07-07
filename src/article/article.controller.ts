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
import { ArticleEntity } from './article.entity';
import { ArticleService } from './article.service';
import { ArticlePayloadDto, GetListArticleDto } from './dto';

@UseGuards(JwtGuard)
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getListArticle(
    @Query() getListArticleDto: GetListArticleDto,
  ): Promise<PageDto<ArticleEntity>> {
    return this.articleService.getArticleList(getListArticleDto);
  }

  @Get('/list/:id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string): Promise<ArticleEntity> {
    return this.articleService.getArticleById(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  signUp(
    @Body() createArticleDto: ArticlePayloadDto,
    @Headers('authorization') authorizationHeader: string,
  ) {
    return this.articleService.createArticle(
      createArticleDto,
      authorizationHeader,
    );
  }

  @Patch('/update-status/:id')
  @HttpCode(HttpStatus.OK)
  updateStatus(@Param('id') id: string, @Body() dataUpdate: UpdateStatusDto) {
    return this.articleService.updateStatus(id, dataUpdate);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  updateArticle(
    @Param('id') articleId: string,
    @Body() dataUpdate: ArticlePayloadDto,
  ): Promise<ResponseDto> {
    return this.articleService.updateArticleById(articleId, dataUpdate);
  }
}
