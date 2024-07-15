import ICommandResponse from "../../../interfaces/cqrs/ICommandResponse";

export default class RefreshTokenCommandResponse implements ICommandResponse {
    constructor(
        public accessToken: string,
        public refreshToken: string
    ) { }
}
