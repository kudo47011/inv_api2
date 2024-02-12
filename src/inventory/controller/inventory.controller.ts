import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from '../service/inventory.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';

@Controller('inventory')
export class InventoryController {

    constructor(private readonly inventorService: InventoryService) {}

    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    editStock(@Body() payload: { amount: number }, @Param('id') id: string) {
        return this.inventorService.editStock(id, payload.amount)
    }

    @Get('/branch/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    getInvByBranch(@Param('id') id: string) {
        return this.inventorService.getStockByBranch(id)
    }

    @Get('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    getAllStock() {
        return this.inventorService.getAllStock()
    }

    @Get('report/:id')
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles(Role.Admin, Role.Employee, Role.Manager)
    report(@Param('id') id: string) {
        return this.inventorService.getDataReport(id)
    }
}
