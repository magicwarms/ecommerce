import { IsEnum, Length } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";

export enum Gender {
    MEN = "MEN",
    WOMEN = "WOMEN",
}

@Entity()
@Index(["firstname", "lastname"])
export class Profile {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", width: 30 })
    @Length(2, 30, {
        message: "Firstname is too short. Minimal length is $constraint1 characters",
    })
    firstname!: string;

    @Column({ type: "varchar", width: 60 })
    @Length(2, 60, {
        message: "Lastname is too short. Minimal length is $constraint1 characters",
    })
    lastname!: string;

    @Column()
    @IsEnum(Gender, { each: true })
    gender!: string;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate?: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate?: Date;

    @DeleteDateColumn({ type: "timestamp with time zone" })
    deletedDate?: Date;
}
