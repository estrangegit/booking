import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository){}

    async create(createUserDto: CreateUserDto) {
        await this.validateCreateUserDto(createUserDto);
        return this.usersRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10)
        });
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.usersRepository.findOne({ email: createUserDto.email });
        } catch(err){
            return;
        }
        throw new UnprocessableEntityException('A user already exists with the corresponding email');
    }

    async verifyUser(email: string, password: string) {
        try{
            const user = await this.usersRepository.findOne({ email });

            const passwordIsValid = await bcrypt.compare(password, user.password);
            if(!passwordIsValid) {
                throw new UnauthorizedException('Invalid credentials')            
            }
            return user;
        } catch(err) {
            throw new UnauthorizedException(err)
        }
    }

    async getUser(getUserDto: GetUserDto) {
        return await this.usersRepository.findOne(getUserDto);
    }
}
