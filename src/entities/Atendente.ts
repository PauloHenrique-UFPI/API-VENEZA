import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity('atendentes')
export class Atendende {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    codAtendente: string

    @ManyToOne(type => Usuario, content => Atendende, {eager: true})
    @JoinColumn({name: 'usuario_id'})
    usuario: Usuario
}