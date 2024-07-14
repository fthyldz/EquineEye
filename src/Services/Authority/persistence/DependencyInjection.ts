import Container from "typedi";
import AuthInfoRepository from "./database/repositories/AuthInfoRepository";

export default () => {
    Container.set("AuthInfoRepository", Container.get(AuthInfoRepository));
}
