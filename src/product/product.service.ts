import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return await this.productRepository.save(newProduct);
  }

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    await this.productRepository.update(id, product);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}

