import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('bairos')
export class Bairo{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @Column()
    taxaEntrega: number
}