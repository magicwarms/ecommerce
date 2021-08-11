export interface UserInterface {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    createdDate: Date;
    updatedDate: Date;
    deletedDate: Date;
}
