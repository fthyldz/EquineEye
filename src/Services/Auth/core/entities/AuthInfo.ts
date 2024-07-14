import { IEntity } from "./interfaces/IEntity";

export class AuthInfo implements IEntity {
    public _id?: string;
    public externalId: string;
    public email: string;
    public passwordHashed: string;
    public passwordSalt: string;

    constructor({ externalId, email, passwordHashed, passwordSalt }: { externalId: string; email: string; passwordHashed: string, passwordSalt: string }) {
        this.externalId = externalId;
        this.email = email;
        this.passwordHashed = passwordHashed;
        this.passwordSalt = passwordSalt;
    }
}
