import { NextFunction, Request, Response } from "express";
import * as ItemService from "./items.service";

export const findAllMenu = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await ItemService.findAllMenu();
        return res.status(200).json({
            success: true,
            data: items,
            message: "Menus data found",
        });
    } catch (err) {
        next(err);
    }
};

export const findMenu = (req: Request, res: Response, next: NextFunction) => {
    try {
        const menuId: string = String(req.query.id);
        if (!menuId)
            return res.status(422).json({
                success: false,
                data: null,
                message: "Menu ID is required",
            });
        const findItem = ItemService.findMenu(menuId);
        if (!findItem) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Menu data not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: findItem,
            message: "Menu data found",
        });
    } catch (err) {
        next(err);
    }
};

export const updateOrStoreMenu = (req: Request, res: Response, next: NextFunction) => {
    try {
        const menuId = req.body.id;
        let status = !menuId ? "saved" : "updated";
        let storeOrUpdateMenu;
        const menuBody = req.body;
        if (!menuId) {
            storeOrUpdateMenu = ItemService.createMenu(menuBody);
        } else {
            storeOrUpdateMenu = ItemService.updateMenu(menuBody);
        }
        if (!storeOrUpdateMenu) {
            return res.status(500).json({
                success: false,
                data: null,
                message: `Menu data not successfully ${status}`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateMenu,
            message: `Menu data successfully ${status}`,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const menuId = req.body.id;
        if (!menuId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Menu ID is required`,
            });
        }
        ItemService.deleteMenu(menuId);
        return res.status(200).json({
            success: true,
            data: null,
            message: "Menus data successfully deleted",
        });
    } catch (err) {
        next(err);
    }
};
