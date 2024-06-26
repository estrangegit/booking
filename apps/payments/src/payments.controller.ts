import { CreateChargeDto, PaymentsCreateChargeDto } from '@app/common';
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @MessagePattern('create_charge')
    @UsePipes(new ValidationPipe())
    async createCharge(@Payload() data: PaymentsCreateChargeDto) {
        return this.paymentsService.createCharge(data);
    }
}
