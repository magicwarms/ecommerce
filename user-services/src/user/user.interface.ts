export interface BaseUser {
    id?: string;
    firstname: string;
    lastname: number;
    email: string;
    password?: string;
    createdDate: Date;
    updatedDate: Date;
}
