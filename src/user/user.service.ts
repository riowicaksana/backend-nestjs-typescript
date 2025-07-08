import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {

    if (!user.password) {
    throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async update(id: number, user: Partial<User>): Promise<User| null> {
    await this.userRepository.update(id, user);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}