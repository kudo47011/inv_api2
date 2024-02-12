import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BranchService } from '../service/branch.service';
import { BranchCreateDto } from '../dto/create-branch.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { BranchUpdateDto } from '../dto/update-branch.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Role } from 'src/utils/role.enum';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('branch')
export class BranchController {

    constructor(private readonly branchService: BranchService) {}

    @Post('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    create(@Body() payload: BranchCreateDto, @Req() req) {
        const { user } = req;
        payload.user_create = user.userid
        return this.branchService.create(payload);
    }

    // @Get('')
    // findAll(@Query() pagination: PaginationDto) {
    //     const { page, limit, query } = pagination;
    //     return this.branchService.findAll(+page, +limit, query);
    // }

    @Get('')
    findAll() {
        return this.branchService.findAll2();
    }

    @Get('find/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    findOne(@Param('id') id: string) {
        return this.branchService.findOne(id);
    }

    @Get('my/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    getBranchByManager(@Param('id') id: string) {
        return this.branchService.getBranchByManager(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    update(@Body() payload: BranchUpdateDto, @Param('id') id: string) {
        return this.branchService.update(id, payload)
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    remove(@Param('id') id: string) {
        return this.branchService.remove(id)
    }
}
