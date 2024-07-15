export default interface IHandler {
    execute(request: any): Promise<any>;
}
