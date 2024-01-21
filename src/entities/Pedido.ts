import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    qtd: number

    @Column()
    tipo: string

    @Column()
    tamanho: string

    @Column()
    complemento: string

    @Column({nullable: true})
    preco: string

    @Column()
    troco: string

    @Column()
    endereco: string

    @Column()
    nomeCliente: string

    @Column()
    contato: string

    @Column()
    status: string

    @Column({nullable: true})
    img: string
}