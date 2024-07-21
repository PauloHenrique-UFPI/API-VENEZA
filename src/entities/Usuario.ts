import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./Pedido";
import { Endereco } from "./Endereco";
import { UsuariosTipo } from "../enums/usuariosTipo";

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @Column()
    email: string

    @Column()
    telefone: string

    @Column()
    dataNascimento: Date

    @Column()
    senha: string

    // @Column()
    // cep: string

    // @Column()
    // endereco: string {nullable: true}

    @Column({type: 'enum', enum: UsuariosTipo, nullable: true})
    usuarioTipo: UsuariosTipo

    // enum: user, admin e atendente

    @OneToMany(() => Pedido, pedido => pedido.usuario)
    pedidos: Pedido[]

    @OneToMany(() => Endereco, endereco => endereco.usuario)
    enderecos: Endereco[]
}