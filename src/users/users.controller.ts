import { Controller, Post,Get, Body, Param, ParseIntPipe, Delete, Patch, UseGuards } from '@nestjs/common';
//services
import { UsersService } from './users.service';
//entitis
import { User } from './user.entity';
//Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { createProfileDto } from './dto/create-profile.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/shared/jwt.auth.guard';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Post()
    createUser(@Body() newUser: CreateUserDto) {
        return this.userService.createUser(newUser);
    }

    @Post('login')
    loginUser(@Body() userLogin: LoginUserDto) {
        return this.userService.login(userLogin);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    //Get users/id
    // parseIntPipe para convertir al tipo de dato
    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id:number) {
        return this.userService.getUser(id);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id:number) {
        return this.userService.deleteUser(id);
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
        return this.userService.updateUser(id, user);
    }
    
    // para retornar al cliente se usa return
    @Post(':id/profile')
    createProfile(@Param('id', ParseIntPipe) id: number,
    @Body() profile: createProfileDto) {
        return this.userService.createProfile(id, profile)
    }

}
