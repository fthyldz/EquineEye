import Container from "typedi";
import TokenService from "./services/TokenService";
import RedisDataSource from "./cache/redis/RedisDataSource";

export default () => {
    Container.set("TokenService", Container.get(TokenService));
    Container.set("RedisDataSource", Container.get(RedisDataSource));
}
