import { AppDataSource } from "../data-source";
import { Pizza } from "../entities/Pizza"

export const pizzaRepositorie = AppDataSource.getRepository(Pizza)