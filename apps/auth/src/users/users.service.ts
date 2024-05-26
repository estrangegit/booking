import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {

    constructor(private readonly userRepository: UsersRepository){}

    async create(createUserDto: CreateUserDto) {
        return this.userRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10)
        });
    }

    async verifyUser(email: string, password: string) {
        try{
            const user = await this.userRepository.findOne({ email });

            const passwordIsValid = await bcrypt.compare(password, user.password);
            if(!passwordIsValid) {
                throw new UnauthorizedException('Invalid credentials')            
            }
            return user;
        } catch(err) {
            throw new UnauthorizedException(err)
        }
    }
}
