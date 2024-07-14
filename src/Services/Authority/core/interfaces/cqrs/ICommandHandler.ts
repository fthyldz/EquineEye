import CustomError from '../../common/models/CustomError';
import IHandler from './IHandler';

export default interface ICommandHandler<ICommandRequest, ICommandResponse> extends IHandler {
    execute(commandRequest: ICommandRequest): Promise<ICommandResponse | CustomError>;
}
