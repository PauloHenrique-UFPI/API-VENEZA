import { AppDataSource } from "../data-source";
import { PedidoPizza } from "../entities/PedidoPizza";

export const pedidoPizzaRepositorie = AppDataSource.getRepository(PedidoPizza)