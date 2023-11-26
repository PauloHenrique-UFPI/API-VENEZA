import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";

@Entity('cozinheiros')
export class Cozinheiro {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    codCozinheiro: string

    @ManyToOne(type => Usuario, content => Cozinheiro, {eager: true})
    @JoinColumn({name: 'usuario_id'})
    usuario: Usuario
}