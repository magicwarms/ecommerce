import { getConnection } from "typeorm";
import { User } from "./entity/User";
import { Profile } from "./entity/Profile";
import validation from "../config/validation";

const cacheDuration = 300000;
const userRepo = getConnection().getRepository(User);
const userProfileRepo = getConnection().getRepository(Profile);
/**
 * Repository Methods
 */

export const findAllUser = async () => {
    return await userRepo.find({ cache: cacheDuration, relations: ["profile"] });
};

export const findUser = async (id: String) => {
    return await userRepo.findOne({
        where: { id },
        cache: {
            id: `user-${id}`,
            milliseconds: cacheDuration,
        },
        relations: ["profile"],
    });
};

export const updateOrStoreUserProfile = async (data: Profile) => {
    const profile = new Profile();
    if (data.id) profile.id = data.id;
    profile.firstname = data.firstname;
    profile.lastname = data.lastname;
    profile.gender = data.gender;
    await validation(profile);

    return await userProfileRepo.save(profile);
};

export const updateOrStoreUser = async (data: User) => {
    const user = new User();
    user.id = data.id;
    user.profileId = data.profileId;
    user.email = data.email;
    if (typeof data.id === "undefined") user.password = data.password;
    await validation(user);
    if (data.id !== "") getConnection().queryResultCache?.remove([`user-${data.id}`]);
    return await userRepo.save(user);
};

export const changePasswordUser = async (data: any) => {
    const user = new User();
    user.id = data.id;
    user.password = data.password;
    await validation(user);
    user.password = data.hash;

    return await userRepo.save(user);
};

export const deleteUser = async (id: string) => {
    return await userRepo.softDelete(id);
};
