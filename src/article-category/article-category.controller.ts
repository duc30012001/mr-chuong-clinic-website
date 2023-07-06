import { JwtGuard } from '@/auth/guard';
import { PageDto, ResponseDto, UpdateStatusDto } from '@/utils/dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleCategoryEntity } from './article-category.entity';
import { ArticleCategoryService } from './article-category.service';
import { ArticleCategoryPayloadDto, GetListArticleCategoryDto } from './dto';

@UseGuards(JwtGuard)
@Controller('article-category')
export class ArticleCategoryController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getListArticleCategory(
    @Query() getListArticleCategoryDto: GetListArticleCategoryDto,
  ): Promise<PageDto<ArticleCategoryEntity>> {
    return this.articleCategoryService.getArticleCategoryList(
      getListArticleCategoryDto,
    );
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createArticleCategory(@Body() createUserDto: ArticleCategoryPayloadDto) {
    return this.articleCategoryService.createArticleCategory(createUserDto);
  }

  @Patch('/update-status/:id')
  @HttpCode(HttpStatus.OK)
  updateStatus(@Param('id') id: string, @Body() dataUpdate: UpdateStatusDto) {
    return this.articleCategoryService.updateStatus(id, dataUpdate);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  updateArticleCategory(
    @Param('id') userId: string,
    @Body() dataUpdate: ArticleCategoryPayloadDto,
  ): Promise<ResponseDto> {
    return this.articleCategoryService.updateArticleCategoryById(
      userId,
      dataUpdate,
    );
  }
}
