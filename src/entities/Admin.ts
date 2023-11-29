import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity('admins')
export class Admin {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    codADM: string

    @ManyToOne(type => Usuario, content => Admin, {eager: true})
    @JoinColumn({name: 'usuario_id'})
    usuario: Usuario
}