import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { TransactionDto } from '../dto/request-transaction.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';

@Controller('transaction')
export class TransactionController {
    
    constructor(private readonly transactionService: TransactionService) {}

    @Post('')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    request(@Body() payload: TransactionDto, @Req() req) {
        const { user } = req;
        payload.user_created = user.userid;
        return this.transactionService.request(payload);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    approve(@Param('id') id, @Req() req) {
        const { user } = req;
        return this.transactionService.approveRequest(id, 'In progress', user.userid)
    }

    @Post(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Driver)
    success(@Param('id') id, @Req() req) {
        const { user } = req;
        return this.transactionService.approveRequest(id, 'Success', user.userid)
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    cancel(@Param('id') id, @Req() req) {
        const { user } = req;
        return this.transactionService.cancelRequest(id, user.userid)
    }

    @Get('/wait')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    getWaitingTransaction() {
        return this.transactionService.getWaitingTransaction()
    }

    @Get('/progress')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager, Role.Driver)
    getProgressTransaction() {
        return this.transactionService.getProgressTransaction()
    }

    @Get('/success')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    getSuccessTransaction() {
        return this.transactionService.getSuccessTransaction()
    }

    @Get('/all/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Employee, Role.Manager)
    getAllTransaction(@Param('id') user_id: string) {
        return this.transactionService.getAllTransaction(user_id)
    }
}
