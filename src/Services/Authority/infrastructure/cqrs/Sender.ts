import { Service } from "typedi";
import CustomError from "../../core/exceptions/CustomError";
import IRequest from "../../application/interfaces/cqrs/IRequest";
import IResponse from "../../application/interfaces/cqrs/IResponse";
import ISender from "../../application/interfaces/cqrs/ISender";
import IHandler from "../../application/interfaces/cqrs/IHandler";

@Service()
export default class Sender implements ISender {
    async send(request: IRequest): Promise<IResponse | CustomError> {
        let handler: IHandler = request.getHandlerType();
        return await handler.execute(request);
    }
}
