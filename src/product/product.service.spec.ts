import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const mockProduct: Product = {
    id: 6,
    name: 'Baju Unqlo',
    sku: 'UNQ25',
    quantity: 100,
    createdDate: new Date('2025-07-08T14:59:56.540Z'),
    updatedDate: new Date('2025-07-08T14:59:56.540Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue([mockProduct]),
            findOne: jest.fn().mockResolvedValue(mockProduct)
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findProduct', () => {
    it('should return a product by id', async () => {
      const result = await service.findById(+6);
      console.log(result)
      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        sku: expect.any(String),
        quantity: expect.any(Number),
        createdDate: expect.any(Date),
        updatedDate: expect.any(Date),
      }));
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 6 } });
    });
  });



});
