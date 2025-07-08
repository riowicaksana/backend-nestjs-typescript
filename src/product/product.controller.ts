import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles('admin', 'staff')
  async findAll(@Res() res: Response) {
    const data = await this.productService.findAll();
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Success get all products',
      data,
    });
  }

  @Get(':id')
  @Roles('admin', 'staff')
  async findById(@Param('id') id: number, @Res() res: Response) {
    const product = await this.productService.findById(+id);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
        data: null,
      });
    }
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Success get product',
      data: product,
    });
  }

  @Post()
  @Roles('admin', 'staff')
  async create(@Body() body, @Res() res: Response) {
    const product = await this.productService.create(body);
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      message: 'Product created successfully',
      data: product,
    });
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: number, @Body() body, @Res() res: Response) {
    const updated = await this.productService.update(+id, body);
    if (!updated) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
        data: null,
      });
    }
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Product updated successfully',
      data: updated,
    });
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number, @Res() res: Response) {
    const product = await this.productService.findById(+id);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
        data: null,
      });
    }
    await this.productService.delete(+id);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Product deleted successfully',
      data: null,
    });
  }
}