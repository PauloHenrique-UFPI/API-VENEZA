import { AppDataSource } from "../data-source";
import { Bebida } from "../entities/Bebida";

export const bebidaRepositorie = AppDataSource.getRepository(Bebida)