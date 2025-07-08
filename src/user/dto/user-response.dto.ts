import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  role: string;

  @Expose()
  createdDate: Date;

  @Expose()
  updatedDate: Date;
}