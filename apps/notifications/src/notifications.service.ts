import { NotifyEmailDto } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {

    async notifyEmail({ email }: NotifyEmailDto) {
        console.log(email);
    }
}
