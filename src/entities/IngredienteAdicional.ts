import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ingrediente_adicional')
export class IngredienteAdicional {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({ type: 'float' })
    preco: number;
}
