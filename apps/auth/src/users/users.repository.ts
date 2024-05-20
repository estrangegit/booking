import { Injectable, Logger } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "@app/common";
import { UserDocument } from "./model/user.schema";

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
    protected readonly logger = new Logger(UsersRepository.name)

    constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
        super(userModel);
    }
}
