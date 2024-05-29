import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    qtd: number

    @Column()
    tamanho: string

    @Column({ type: 'float' })
    preco: number

    @Column({ type: 'float', nullable: true })
    troco: number

    @Column()
    endereco: string

    @Column()
    nomeCliente: string

    @Column()
    contato: string

    @Column()
    status: string

    @Column({ type: 'json', nullable: true })
    pizzas: any

    @Column({ type: 'json', nullable: true })
    bebidas: any
}
