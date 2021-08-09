import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", width: 30 })
    firstname: string;

    @Column({ type: "varchar", width: 60 })
    lastname: string;

    @Column({ type: "varchar", width: 50 })
    email: string;

    @Column({ type: "varchar", width: 150, select: false })
    password: string;

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdDate: Date;

    @UpdateDateColumn({ type: "timestamp with time zone" })
    updatedDate: Date;
}
