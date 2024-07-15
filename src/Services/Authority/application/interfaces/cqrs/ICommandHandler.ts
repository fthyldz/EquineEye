import CustomError from '../../../core/exceptions/CustomError';
import IHandler from './IHandler';

export default interface ICommandHandler<ICommandRequest, ICommandResponse> extends IHandler {
    execute(commandRequest: ICommandRequest): Promise<ICommandResponse | CustomError>;
}
