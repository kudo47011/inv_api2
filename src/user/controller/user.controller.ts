import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { PaginationDto } from 'src/utils/pagination.dto';
import { UserCreateDto } from '../dto/create-user.dto';
import { UserUpdateDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Manager, Role.Admin)
    findAll(@Query() pagination: PaginationDto) {
        const { page, limit, query } = pagination;
        return this.userService.findAll(+page, +limit, query);
    }

    @Get('find')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Manager, Role.Admin)
    findToSelect() {
        return this.userService.findToSelectManager();
    }

    @Get('all')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Manager, Role.Admin)
    findNotAdmin() {
        return this.userService.findAllNotAdmin();
    }

    @Post('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Manager, Role.Admin)
    create(@Body() payload: UserCreateDto) {
        return this.userService.create(payload);
    } 

    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Manager, Role.Admin)
    update(@Body() payload: UserUpdateDto, @Param('id') user_id) {
        return this.userService.update(user_id, payload);
    }

    @Patch('/new-password/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Manager, Role.Admin)
    newPassword(@Body() payload: {new_pass: string}, @Param('id') user_id) {
        return this.userService.newPassword(user_id, payload.new_pass);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Manager, Role.Admin)
    remove(@Param('id') user_id) {
        return this.userService.remove(user_id);
    } 

    @Get('find/:id')
    // @UseGuards(JwtAuthGuard, RolesGuard)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Manager, Role.Admin)
    findOne(@Param('id') id) {
        return this.userService.findOne(id);
    }
}
