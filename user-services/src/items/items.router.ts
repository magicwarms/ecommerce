/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import * as ItemController from "./items.controller";
/**
 * Router Definition2
 */
export const itemsRouter = express.Router();
/**
 * Controller Definitions
 */
itemsRouter.get("/greeting", (_req: Request, res: Response) => {
    try {
        return res.status(200).json({ data: "HELLO" });
    } catch (err) {
        console.log(err);
    }
});

// GET items
itemsRouter.get("/items/getall", ItemController.findAllMenu);
// GET items/:id
itemsRouter.get("/items/get", ItemController.findMenu);
// POST items
itemsRouter.post("/items/store", ItemController.updateOrStoreMenu);
// PUT items/:id
itemsRouter.put("/items/update", ItemController.updateOrStoreMenu);
// DELETE items/:id
itemsRouter.delete("/items/delete", ItemController.deleteMenu);
