import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5438,
      username: 'postgres',
      password: 'qwerty1234',
      database: 'postgres',
      entities: [User,Product],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}