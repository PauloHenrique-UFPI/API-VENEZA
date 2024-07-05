import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('borda')
export class Borda {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({ type: 'float' })
    preco: number;
}
