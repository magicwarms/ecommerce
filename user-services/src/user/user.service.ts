/**
 * Data Model Interfaces
 */
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
export const createUser = (newUser: UserInterface): UserInterface => {};
export const updateUser = (updateUser: UserInterface): UserInterface | null => {};
export const deleteUser = (id: string): null | void => {};
