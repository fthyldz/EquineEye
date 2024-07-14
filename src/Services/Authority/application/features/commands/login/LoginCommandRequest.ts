import ICommandRequest from "../../../../core/interfaces/cqrs/ICommandRequest";

export default class LoginCommandRequest implements ICommandRequest {
    constructor(
        public email: string,
        public password: string
    ) { }
}
