export abstract class IUseCase<REQ, RES> {
    abstract execute(request: REQ): Promise<RES>;
}
