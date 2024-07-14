export default interface IHandler {
    execute(commandRequest: any): Promise<any>;
}
