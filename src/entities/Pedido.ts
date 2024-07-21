import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Bebida } from "./Bebida";
import { PedidoPizza } from "./PedidoPizza";
import { Local } from "../enums/localPedido";
import { StatusPedido } from "../enums/statusPedido";
import { FormaPagamento } from "../enums/formaPagamento";
import { Endereco } from "./Endereco";

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column()
    // status: string

    @Column({ type: 'enum', enum: StatusPedido})
    status: StatusPedido;

    @Column({ type: 'enum', enum: FormaPagamento})
    FormaPagamento: FormaPagamento;

    @Column({ type: 'float', nullable: true})
    troco: number;

    @Column({ type: 'float' })
    precoTotal: number;

    @Column({ type: 'enum', enum: Local})
    local: Local;

    @Column({ nullable: true })
    descricao: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" }) // Define a coluna de data e hora com valor padrão
    dataHora: Date;

    @OneToMany(() => PedidoPizza, pedidoPizza => pedidoPizza.pedido, { eager: true, cascade: true })
    pizzas: PedidoPizza[];

    @ManyToMany(() => Bebida, bebida => bebida.pedidos, { eager: true })
    @JoinTable()
    bebidas: Bebida[];

    @ManyToOne(() => Usuario, usuario => usuario.pedidos)
    usuario: Usuario;

    @ManyToOne(() => Endereco, { eager: true, cascade: true })
    enderecoEntrega: Endereco;
}
