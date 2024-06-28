import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Promocao } from "./Promocao";
import { Categoria } from "../enums/categoriasPizza";
import { Tamanho } from "../enums/tamanhosPizza";
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

    @Column({type: 'json'})
    precos: {[key in Tamanho]: number}

    @Column({type: 'enum', enum: Categoria})
    categoria: Categoria

    @OneToMany(() => Promocao, promocao => promocao.pizza)
    promocoes: Promocao[]

    // @Column()
    // promocao: boolean
}