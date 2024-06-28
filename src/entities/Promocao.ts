import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pizza } from "./Pizza";
import { Tamanho } from "../enums/tamanhosPizza";
import { Bebida } from "./Bebida";

@Entity('promocao')
export class Promocao {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Pizza, pizza => pizza.promocoes, { nullable: true })
    pizza: Pizza

    @ManyToOne(() => Bebida, bebida => bebida.promocoes, { nullable: true })
    bebida: Bebida

    @Column({type: 'enum', enum: Tamanho})
    tamanho: Tamanho

    @Column('decimal')
    precoPromocional: number

    @Column()
    descricao: string
}
