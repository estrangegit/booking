import { AUTH_SERVICE, DatabaseModule, HealthModule, LoggerModule, PAYMENTS_SERVICE } from '@app/common';
import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ReservationDocument, ReservationSchema } from './models/reservation.schema';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
    imports: [DatabaseModule,
        DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
        LoggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                MONGODB_URI: Joi.string().required(),
                PORT: Joi.number().required(),
                AUTH_HOST: Joi.string().required(),
                AUTH_PORT: Joi.number().required(),
                PAYMENTS_HOST: Joi.string().required(),
                PAYMENTS_PORT: Joi.number().required()
            }),
        }),
        ClientsModule.registerAsync([
            {
                name: AUTH_SERVICE,
                useFactory: (configService: ConfigService) => ({
                    transpport: Transport.TCP,
                    options: {
                        host: configService.get<string>('AUTH_HOST'),
                        port: configService.get<number>('AUTH_PORT')
                    }
                }),
                inject: [ConfigService]
            },
            {
                name: PAYMENTS_SERVICE,
                useFactory: (configService: ConfigService) => ({
                    transpport: Transport.TCP,
                    options: {
                        host: configService.get<string>('PAYMENTS_HOST'),
                        port: configService.get<number>('PAYMENTS_PORT')
                    }
                }),
                inject: [ConfigService]
            },
        ]),
        HealthModule
    ],
    controllers: [ReservationsController],
    providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule { }
