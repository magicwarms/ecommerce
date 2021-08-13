/**
 * Data Model Interfaces
 */
import bcrypt from "bcrypt";

import logger from "../config/logger";
import { UserInterface } from "./user.interface";
import * as UserRepository from "./user.repository";

/**
 * Service Methods
 */

export const findAllUser = async (): Promise<UserInterface[]> => {
    let getAllUser = await UserRepository.findAllUser();
    if (getAllUser.length < 0) getAllUser = [];
    return getAllUser;
};
export const findUser = async (id: string): Promise<UserInterface | null> => {
    const getUser = await UserRepository.findUser(id);
    return !getUser ? null : getUser;
};
export const updateOrStoreUser = async (newUser: UserInterface): Promise<UserInterface | any> => {
    const updateOrUser = await UserRepository.updateOrStoreUser(newUser);
    if (!updateOrUser) return new Error("Data not successfully updated");
    if (newUser.id === "" || !newUser.id) {
        bcrypt.hash(newUser.password, 12, async function (err, hash) {
            if (err) logger.error({ message: err });
            newUser.password = hash;
            newUser.id = updateOrUser.id;
            const updatePassword = await UserRepository.updateOrStoreUser(newUser);
            if (!updatePassword) return new Error("Generate hash password error}");
        });
    }
    return updateOrUser;
};
export const deleteUser = async (id: string): Promise<any> => {
    return await UserRepository.deleteUser(id);
};
