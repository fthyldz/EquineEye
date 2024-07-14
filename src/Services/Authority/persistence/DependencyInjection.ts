import Container from "typedi";
import AuthInfoRepository from "./database/repositories/AuthInfoRepository";
import MongoDBDataSource from "./database/mongodb/MongoDBDataSource";

export default () => {
    Container.set("AuthInfoRepository", Container.get(AuthInfoRepository));
}
