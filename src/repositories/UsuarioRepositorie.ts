import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario"; 

export const userRepositorie = AppDataSource.getRepository(Usuario)