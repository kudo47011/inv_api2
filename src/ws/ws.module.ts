import { Module } from '@nestjs/common';
import { TransactionGateway } from './transaction.gateway';

@Module({
    providers: [
        TransactionGateway
    ],
    exports: [
        TransactionGateway
    ]
})
export class WsModule {}
