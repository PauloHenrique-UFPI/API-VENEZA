import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Bairo } from "./Bairo";

@Entity('enderecos')
export class Endereco {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    cep: string

    @Column()
    endereco: string

    @Column()
    referencia: string

    @ManyToOne(() => Usuario, usuario => usuario.id, {nullable: true})
    usuario: Usuario

    @ManyToOne(() => Bairo, bairo => bairo.id, {nullable: true})
    bairo: Bairo
}