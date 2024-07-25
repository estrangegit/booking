import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { UsersService } from '../users/users.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    return request?.cookies?.Authentication 
                    || request?.Authentication 
                    || request?.headers.authentication;
                }
            ]),
            secretOrKey: configService.get<string>('JWT_SECRET'),
            ignoreExpiration: false,
        });
    }

    async validate({ userId }: TokenPayload) {
        return await this.usersService.getUser({ _id: userId });
    }
}