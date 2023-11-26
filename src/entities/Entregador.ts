import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity('entregadores')
export class Entregador {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    codEntregador: string

    @ManyToOne(type => Usuario, content => Entregador, {eager: true})
    @JoinColumn({name: 'usuario_id'})
    usuario: Usuario
}