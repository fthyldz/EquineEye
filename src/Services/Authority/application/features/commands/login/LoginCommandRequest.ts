import Container from "typedi";
import ICommandRequest from "../../../interfaces/cqrs/ICommandRequest";
import IHandler from "../../../interfaces/cqrs/IHandler";
import LoginCommandHandler from "./LoginCommandHandler";

export default class LoginCommandRequest implements ICommandRequest {
    constructor(
        public email: string,
        public password: string
    ) { }

    public getHandlerType(): IHandler {
        return Container.get(LoginCommandHandler);
    }
}
