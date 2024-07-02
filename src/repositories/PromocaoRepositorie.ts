import { AppDataSource } from "../data-source";
import { Promocao } from "../entities/Promocao";

export const promocaoRepositorie = AppDataSource.getRepository(Promocao)