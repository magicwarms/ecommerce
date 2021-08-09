/**
 * Data Model Interfaces
 */
import { BaseItem } from "./item.interface";
// import { Items } from "./items.interface";
import { v4 } from "uuid";
/**
 * In-Memory Store
 */

let items: BaseItem[] = [
    {
        id: "65125c63-e36e-4366-85bc-de99c168c4a9",
        name: "Burger",
        price: 599,
        description: "Tasty",
        image: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png",
    },
    {
        id: "7649a7c4-0881-401b-ba39-0c0ac34882eb",
        name: "Pizza",
        price: 299,
        description: "Cheesy",
        image: "https://cdn.auth0.com/blog/whatabyte/pizza-sm.png",
    },
    {
        id: "9f0401f4-005f-41e8-bdbc-34b8d4208745",
        name: "Tea",
        price: 199,
        description: "Informative",
        image: "https://cdn.auth0.com/blog/whatabyte/tea-sm.png",
    },
];
/**
 * Service Methods
 */

export const findAllMenu = async (): Promise<BaseItem[]> => Object.values(items);
export const findMenu = (id: string): BaseItem | null => {
    const findItem = items.find((item) => {
        return item.id === id;
    });
    if (!findItem) return null;
    return findItem;
};
export const createMenu = (newItem: BaseItem): BaseItem => {
    const id: string = v4();
    items.push({
        id,
        ...newItem,
    });
    newItem.id = id;
    return newItem;
};
export const updateMenu = (itemUpdate: BaseItem): BaseItem | null => {
    if (!itemUpdate.id) return null;
    const item = findMenu(itemUpdate.id);
    if (!item) return null;
    items.forEach((menu, index) => {
        if (menu.id === item.id) items.splice(index, 1);
    });
    const updatedItem = { ...itemUpdate };
    items.push(updatedItem);
    return updatedItem;
};
export const deleteMenu = (id: string): null | void => {
    const item = findMenu(id);
    if (!item) return null;
    items.forEach((menu, index) => {
        if (menu.id === item.id) items.splice(index, 1);
    });
    return;
};
