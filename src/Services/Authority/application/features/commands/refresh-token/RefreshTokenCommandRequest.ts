import ICommandRequest from "../../../../core/interfaces/cqrs/ICommandRequest";

export default class RefreshTokenRequest implements ICommandRequest {
    constructor(
        public refreshToken: string
    ) { }
}