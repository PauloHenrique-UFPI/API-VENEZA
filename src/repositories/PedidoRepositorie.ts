import { AppDataSource } from "../data-source";
import { Pedido } from "../entities/Pedido";

export const pedidoRepositorie = AppDataSource.getRepository(Pedido)