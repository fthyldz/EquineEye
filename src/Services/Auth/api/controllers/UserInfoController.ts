import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Container, { Service } from "typedi";
import { UserInfoService } from "../../application/services/UserInfoService";
import { IUserInfoController } from "../../interfaces/controllers/IUserInfoController";

@Service()
export class UserInfoController implements IUserInfoController {
    private readonly _userInfoService: UserInfoService;
    constructor() {
        this._userInfoService = Container.get(UserInfoService);
    }

    public async getUserInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.query.id as string;
            const userInfo = await this._userInfoService.getById(id);
            if (!userInfo) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Kullanıcı Bulunamadı' });
            }
            return res.status(StatusCodes.OK).json(userInfo);
        } catch (error) {
            next(error);
        }
    }
}
