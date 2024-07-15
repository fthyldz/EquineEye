import Container from "typedi";
import ICommandRequest from "../../../interfaces/cqrs/ICommandRequest";
import IHandler from "../../../interfaces/cqrs/IHandler";
import RefreshTokenCommandHandler from "./RefreshTokenCommandHandler";

export default class RefreshTokenRequest implements ICommandRequest {
    constructor(
        public refreshToken: string
    ) { }

    public getHandlerType(): IHandler {
        return Container.get(RefreshTokenCommandHandler);
    }
}