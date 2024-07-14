import Container, { Service } from "typedi";
import CustomError from "../../core/common/models/CustomError";
import IRequest from "../../core/interfaces/cqrs/IRequest";
import IResponse from "../../core/interfaces/cqrs/IResponse";
import ISender from "../../core/interfaces/cqrs/ISender";
import LoginCommandHandler from "../../application/features/commands/login/LoginCommandHandler";
import LoginCommandRequest from "../../application/features/commands/login/LoginCommandRequest";
import RefreshTokenCommandRequest from "../../application/features/commands/refresh-token/RefreshTokenCommandRequest";
import RefreshTokenCommandHandler from "../../application/features/commands/refresh-token/RefreshTokenCommandHandler";
import IHandler from "../../core/interfaces/cqrs/IHandler";

@Service()
export default class Sender implements ISender {
    async send(request: IRequest): Promise<IResponse | CustomError> {
        let handler: IHandler;
        switch (request.constructor) {
            case LoginCommandRequest:
                handler = Container.get(LoginCommandHandler);
                break;
            case RefreshTokenCommandRequest:
                handler = Container.get(RefreshTokenCommandHandler);
                break;
            default:
                return new CustomError("");
        }
        return await handler.execute(request);
    }
}
