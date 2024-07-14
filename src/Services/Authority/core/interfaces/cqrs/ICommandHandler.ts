import CustomError from '../../common/models/CustomError';

export default interface ICommandHandler<ICommandRequest, ICommandResponse> {
    execute(commandRequest: ICommandRequest): Promise<ICommandResponse | CustomError>;
}
