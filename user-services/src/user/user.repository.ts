import { getConnection } from "typeorm";
import { User } from "./entity/User";

// const cacheDuration = 300000;
const userRepo = getConnection().getRepository(User);

/**
 * Repository Methods
 */

export const findAllUser = async () => {
    return await userRepo.find();
};
