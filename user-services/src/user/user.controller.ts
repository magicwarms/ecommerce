import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import * as UserService from "./user.service";

export const findAllUser = async (_req: Request, res: Response) => {
    const users = await UserService.findAllUser();
    return res.status(200).json({
        success: true,
        data: users,
        message: "Users data is found",
    });
};

export const findUser = (req: Request, res: Response) => {
    const userId = String(req.query.id);
    if (!userId)
        return res.status(422).json({
            success: false,
            data: null,
            message: "User ID is required",
        });
    const findUser = UserService.findUser(userId);
    if (!findUser) {
        return res.status(200).json({
            success: true,
            data: null,
            message: "User data is not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: findUser,
        message: "User data found",
    });
};

export const updateOrStoreUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.id;
        let status = !userId ? "saved" : "updated";
        let storeOrUpdateUser;
        const menuBody = req.body;
        if (!userId) {
            storeOrUpdateUser = UserService.createUser(menuBody);
        } else {
            storeOrUpdateUser = UserService.updateUser(menuBody);
        }
        if (!storeOrUpdateUser) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `User data not successfully ${status}`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateUser,
            message: `User data successfully ${status}`,
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.id;
        if (!userId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `User ID is required`,
            });
        }
        UserService.deleteUser(userId);
        return res.status(200).json({
            success: true,
            data: null,
            message: "User data successfully deleted",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};
