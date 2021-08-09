/**
 * Data Model Interfaces
 */
import { BaseUser } from "./user.interface";
import * as UserRepository from "./user.repository";

/**
 * Service Methods
 */

export const findAllUser = async () => {
    return await UserRepository.findAllUser();
};
export const findUser = (id: string): BaseUser | null => {};
export const createUser = (newUser: BaseUser): BaseUser => {};
export const updateUser = (updateUser: BaseUser): BaseUser | null => {};
export const deleteUser = (id: string): null | void => {};
