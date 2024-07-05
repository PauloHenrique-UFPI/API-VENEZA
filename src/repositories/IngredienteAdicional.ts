import { AppDataSource } from "../data-source";
import { IngredienteAdicional } from "../entities/IngredienteAdicional";

export const ingredienteAdicionalRepositorie = AppDataSource.getRepository(IngredienteAdicional);