import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {

  constructor(private readonly reservationRepostory: ReservationsRepository) {}

  create(createReservationDto: CreateReservationDto, userId: string) {
    return this.reservationRepostory.create({
      ...createReservationDto,
      timestamp: new Date(),
      userId
    });
  }

  findAll() {
    return this.reservationRepostory.find({})
  }

  findOne(_id: string) {
    return this.reservationRepostory.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepostory.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto}
     )
  }

  remove(_id: string) {
    return this.reservationRepostory.findOneAndDelete({ _id })
  }
}
