import { AppDataSource } from "../data-source";
import { Borda } from "../entities/Borda";

export const bordaRepositorie = AppDataSource.getRepository(Borda)