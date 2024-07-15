import CustomError from "../../../core/exceptions/CustomError";
import IRequest from "./IRequest";
import IResponse from "./IResponse";

export default interface ISender {
    send(request: IRequest): Promise<IResponse | CustomError>;
}
