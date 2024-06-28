import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Promocao } from "./Promocao";

@Entity('bebida')
export class Bebida {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    qtd: number

    @Column()
    img: string

    @Column()
    nome: string

    @Column()
    litros: string

    @Column({ type: 'float' }) 
    preco: number

    @OneToMany(() => Promocao, promocao => promocao.bebida)
    promocoes: Promocao[]

    @Column()
    promocao: boolean
    
}