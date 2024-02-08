import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductCreateDto } from '../dto/create-product.dto';
import { ProductService } from '../service/product.service';
import { ProductUpdateDto } from '../dto/update-product.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) {}

    @Post('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    @UseInterceptors(FileInterceptor('image'))
    create(
        @UploadedFile() image: Express.Multer.File,
        @Body() payload: ProductCreateDto,
        @Req() req: any
    ) {
        if (!image) {
            throw new HttpException('กรุณาใส่รูปภาพ', HttpStatus.BAD_REQUEST);
        }
        const { user } = req;
        payload.user_created = user.userid
        payload.image = image.filename;
        return this.productService.create(payload);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    @UseInterceptors(FileInterceptor('image'))
    update(
        @UploadedFile() image: Express.Multer.File, 
        @Param('id') id: string, 
        @Body() productUpdateDto: ProductUpdateDto, 
        @Req() req
    ) {
        if (image) {
            productUpdateDto.image = image.filename;  
        }
        const { user } = req;
        productUpdateDto.user_updated = user.userid;
        return this.productService.update(id, productUpdateDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    remove(@Param('id') id:string) {
        return this.productService.remove(id);
    }

    @Get('find/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager, Role.Driver)
    findOne(@Param('id') id:string) {
        return this.productService.findOne(id);
    }

    @Get('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager, Role.Driver)
    findAll() {
        return this.productService.findAll();
    }
}
