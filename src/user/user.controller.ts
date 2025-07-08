import { Controller, Get, Put, Delete, Body, Param, NotFoundException, UseGuards, HttpStatus, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @Roles('admin', 'staff')
    async findAll(@Res() res: Response) {
        const users = await this.userService.findAll();
        const data = users.map(user =>
            plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true })
        );

        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Success get all users',
            data,
        });
    }

    @Get(':username')
    @Roles('admin', 'staff')
    async findOne(@Param('username') username: string, @Res() res: Response) {
        const user = await this.userService.findOne(username);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: `User with username ${username} not found`,
                data: null,
            });
        }
        const data = plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Success get user',
            data,
        });
    }

    @Put(':id')
    @Roles('admin')
    async update(@Param('id') id: number, @Body() user: Partial<User>, @Res() res: Response) {
        const updatedUser = await this.userService.update(+id, user);
        if (!updatedUser) {
            return res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: `User with id ${id} not found`,
                data: null,
            });
        }
        const data = plainToInstance(UserResponseDto, updatedUser, { excludeExtraneousValues: true });
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Success update user',
            data,
        });
    }

    @Delete(':id')
    @Roles('admin')
    async delete(@Param('id') id: number, @Res() res: Response) {
        const user = await this.userService.findById(+id);
        if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({
                status: HttpStatus.NOT_FOUND,
                message: `User with id ${id} not found`,
                data: null,
            });
        }
        await this.userService.delete(+id);
        return res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Success delete user',
            data: null,
        });
    }
}