import { getConnection } from "typeorm";
import { UserInterface } from "./user.interface";
import { User } from "./entity/User";

// const cacheDuration = 300000;
const userRepo = getConnection().getRepository(User);
/**
 * Repository Methods
 */

export const findAllUser = async () => {
    return await userRepo.find();
};

export const findUser = async (id: String) => {
    return await userRepo.findOne({ where: { id }, cache: true });
};

export const updateOrStoreUser = async (data: UserInterface) => {
    const user = new User();
    user.id = data.id;
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    user.email = data.email;
    user.password = data.password;

    return await userRepo.save(user);
};

export const deleteUser = async (id: string) => {
    return await userRepo.softDelete(id);
};
