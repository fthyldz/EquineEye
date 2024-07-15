import IHandler from "./IHandler";

export default interface IRequest {
    getHandlerType(): IHandler;
}
