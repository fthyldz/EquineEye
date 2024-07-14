import ICommand from "../../../../core/interfaces/cqrs/ICommandRequest";

export default class RefreshTokenCommandResponse implements ICommand {
    constructor(
        public accessToken: string,
        public refreshToken: string
    ) { }
}
