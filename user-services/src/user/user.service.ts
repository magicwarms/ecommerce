/**
 * Data Model Interfaces
 */
import bcrypt from "bcrypt";

import logger from "../config/logger";
import { User } from "./entity/User";
import * as UserRepository from "./user.repository";

/**
 * Service Methods
 */

export const findAllUser = async (): Promise<User[]> => {
    let getAllUser = await UserRepository.findAllUser();
    if (getAllUser.length < 0) getAllUser = [];
    return getAllUser;
};
export const findUser = async (id: string): Promise<User | null> => {
    const getUser = await UserRepository.findUser(id);
    return !getUser ? null : getUser;
};
export const updateOrStoreUser = async (userData: any): Promise<User | Error> => {
    const updateOrStoreUserProfile = await UserRepository.updateOrStoreUserProfile(userData.profile);
    if (!updateOrStoreUserProfile) return new Error("Data not successfully updated");
    const newUser: User = {
        id: userData.id === "" ? undefined : userData.id,
        email: userData.email,
        password: userData.password,
        profileId: updateOrStoreUserProfile.id,
    };
    const updateOrStoreUser = await UserRepository.updateOrStoreUser(newUser);

    if (typeof newUser.id === "undefined") {
        bcrypt.hash(newUser.password, 12, async function (err, hash) {
            if (err) logger.error({ message: err });
            newUser.password = hash;
            newUser.id = updateOrStoreUser.id;
            const updatePassword = await UserRepository.updatePasswordUser(newUser);
            if (!updatePassword) return new Error("Generate and store hash password error");
        });
    }
    return updateOrStoreUser;
};
export const deleteUser = async (id: string): Promise<any> => {
    return await UserRepository.deleteUser(id);
};
