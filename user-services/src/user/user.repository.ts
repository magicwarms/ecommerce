import { getConnection } from "typeorm";
import { User } from "./entity/User";

const cacheDuration = 300000;
/**
 * Repository Methods
 */

export const findAllUser = async () => {
    return await getConnection().getRepository(User).find({ cache: cacheDuration });
};
