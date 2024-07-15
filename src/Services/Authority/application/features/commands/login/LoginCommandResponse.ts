import ICommandResponse from "../../../interfaces/cqrs/ICommandResponse";

export default class LoginCommandResponse implements ICommandResponse {
    constructor(
        public accessToken: string,
        public refreshToken: string
    ) { }
}
