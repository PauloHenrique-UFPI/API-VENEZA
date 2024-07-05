import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Bebida } from "./Bebida";
import { PedidoPizza } from "./PedidoPizza";
import { Local } from "../enums/localPedido";

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    status: string

    @Column({ type: 'float' })
    precoTotal: number;

    @Column({ type: 'enum', enum: Local})
    local: Local

    @Column({ nullable: true })
    descricao: string;

    @OneToMany(() => PedidoPizza, pedidoPizza => pedidoPizza.pedido, { eager: true, cascade: true })
    pizzas: PedidoPizza[];

    @ManyToMany(() => Bebida, bebida => bebida.pedidos, { eager: true })
    @JoinTable()
    bebidas: Bebida[];

    @ManyToOne(() => Usuario, usuario => usuario.pedidos)
    usuario: Usuario
}
