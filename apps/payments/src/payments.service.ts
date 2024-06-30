import { NOTIFICATIONS_SERVICE, PaymentsCreateChargeDto } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';


@Injectable()
export class PaymentsService {

    private readonly stripe = new Stripe(
        this.configService.get<string>('STRIPE_SECRET_KEY'),
        {
            apiVersion: '2024-04-10'
        }
    );

    constructor(private readonly configService: ConfigService,
        @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy
    ) { }

    async createCharge({ amount, email }: PaymentsCreateChargeDto) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            payment_method: 'pm_card_visa',
            automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
            amount: amount * 100,
            confirm: true,
            currency: 'usd'
        })

        this.notificationsService.emit('notify_email', { email })

        return paymentIntent;
    }
}
