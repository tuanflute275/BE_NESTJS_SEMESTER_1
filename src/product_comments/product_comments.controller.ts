import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductCommentsService } from './product_comments.service';
import { CreateProductCommentDto } from './dto/create-product_comment.dto';
import { UpdateProductCommentDto } from './dto/update-product_comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('product_comments')
@ApiTags('product-comments')
export class ProductCommentsController {
  constructor(private readonly productCommentsService: ProductCommentsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductCommentDto: CreateProductCommentDto) {
    return this.productCommentsService.create(createProductCommentDto);
  }

  @UseGuards(AuthGuard)
  @Get('query')
  async query(@Req() request: Request) {

    const builder = this.productCommentsService.queryBuilder('product_comments');

    //filter
    if (request.query.name) {
      let name = request.query.name;
      builder.andWhere(`name LIKE '%${name}%'`);
    }

    //sort
    if (request.query._sort) {
      let sortString = request.query._sort;
      let sort_arr = sortString.toString().split('-');
      builder.orderBy(sort_arr[0], sort_arr[1] == 'ASC' ? 'ASC' : 'DESC');
    }

    // paginate
    if (request.query.page || request.query.limit) {
      const page: number = parseInt(request.query.page as any) || 1;
      const perPage: number = parseInt(request.query.limit as any) || 1;

      builder.offset((page - 1) * perPage).limit(perPage);
    }

    return await builder.getMany();
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(){
    return await this.productCommentsService.findAll();
  }
  

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCommentsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductCommentDto: UpdateProductCommentDto) {
    return this.productCommentsService.update(+id, updateProductCommentDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productCommentsService.delete(+id);
  }
}
