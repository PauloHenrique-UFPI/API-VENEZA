import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./Pedido";

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    telefone: string

    @Column()
    dataNascimento: Date

    @Column()
    senha: string

    @Column()
    cep: string

    @Column()
    endereco: string

    @Column({nullable: true})
    tipo: string

    @OneToMany(() => Pedido, pedido => pedido.usuario)
    pedidos: Pedido[]
}