import { AppDataSource } from "../data-source";
import { Endereco } from "../entities/Endereco";

export const enderecoUsuarioRepositorie = AppDataSource.getRepository(Endereco)