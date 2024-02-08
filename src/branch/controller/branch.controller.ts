import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BranchService } from '../service/branch.service';
import { BranchCreateDto } from '../dto/create-branch.dto';
import { PaginationDto } from 'src/utils/pagination.dto';
import { BranchUpdateDto } from '../dto/update-branch.dto';

@Controller('branch')
export class BranchController {

    constructor(private readonly branchService: BranchService) {}

    @Post('')
    create(@Body() payload: BranchCreateDto) {
        return this.branchService.create(payload);
    }

    @Get('')
    findAll(@Query() pagination: PaginationDto) {
        const { page, limit, query } = pagination;
        return this.branchService.findAll(+page, +limit, query);
    }

    @Get('find/:id')
    findOne(@Param('id') id: string) {
        return this.branchService.findOne(id);
    }

    @Patch(':id')
    update(@Body() payload: BranchUpdateDto, @Param('id') id: string) {
        return this.branchService.update(id, payload)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.branchService.remove(id)
    }
}
