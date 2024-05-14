import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('bebida')
export class Bebida {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    img: string

    @Column()
    nome: string

    @Column()
    litros: string

    @Column({ type: 'float' }) 
    preco: number

    @Column()
    promocao: boolean
}