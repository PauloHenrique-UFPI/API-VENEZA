import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    tipo: string
}