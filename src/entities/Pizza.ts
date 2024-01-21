import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pizza')
export class Pizza {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    img: string

    @Column()
    sabor: string

    @Column()
    ingredientes: string

    @Column()
    preco: number

    @Column()
    promocao: boolean
}