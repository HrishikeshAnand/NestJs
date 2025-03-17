import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({
        nullable: true,
        default: ''
    })
    role: string;

}