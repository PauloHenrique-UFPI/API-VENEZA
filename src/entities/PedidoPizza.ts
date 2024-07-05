import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column } from 'typeorm';
import { Pedido } from './Pedido';
import { Pizza } from './Pizza';
import { Borda } from './Borda';
import { IngredienteAdicional } from './IngredienteAdicional';
import { Tamanho } from '../enums/tamanhosPizza';

@Entity('pedido_pizza')
export class PedidoPizza {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pedido, pedido => pedido.pizzas)
    pedido: Pedido;

    // @ManyToOne(() => Pizza)
    // pizza: Pizza;

    @ManyToMany(() => Pizza, { eager: true})
    @JoinTable()
    sabores: Pizza[]

    @ManyToOne(() => Borda, { nullable: true })
    borda: Borda;

    @ManyToMany(() => IngredienteAdicional)
    @JoinTable()
    ingredientesAdicionais: IngredienteAdicional[];

    @Column({ type: 'float' })
    precoTotal: number;

    @Column({ type: 'enum', enum: Tamanho})
    tamanho: Tamanho

    // @Column({ type: 'enum', enum: Tamanho })
    // tamanho: Tamanho;
}
