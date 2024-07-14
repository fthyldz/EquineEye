import IEntity from "../interfaces/entities/IEntity";

export default class AuthInfo extends IEntity {
    constructor(public userId: string, public email: string, public passwordHashed: string, public passwordSalt: string, public _id?: string) {
        super(_id);
    }
}
