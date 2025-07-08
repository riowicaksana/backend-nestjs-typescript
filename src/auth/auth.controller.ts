import { Controller, Post, Body, Res, HttpStatus, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    const user = await this.authService.validateUser(body.username, body.password);
    const token = await this.authService.login(user);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Login successful',
      data: token,
    });
  }

  @Post('register')
  async register(@Body() body, @Res() res: Response) {
    const existingUser = await this.userService.findOne(body.username);
    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({
        status: HttpStatus.CONFLICT,
        message: `Username ${body.username} is already taken`,
        data: null,
      });
    }

    const newUser = await this.userService.create({
      username: body.username,
      password: body.password,
      role: body.role || 'staff',
    });

    const data = plainToInstance(UserResponseDto, newUser, { excludeExtraneousValues: true });

    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      message: 'User successfully registered',
      data,
    });
  }
}