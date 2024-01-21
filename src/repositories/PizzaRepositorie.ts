import { AppDataSource } from "../data-source";
import { Pizza } from "../entities/Pizza"

export const pedidoRepositorie = AppDataSource.getRepository(Pizza)