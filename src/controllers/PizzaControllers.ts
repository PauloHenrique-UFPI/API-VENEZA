import { Request, Response } from "express";
import { pedidoRepositorie } from "../repositories/PizzaRepositorie";

export class PizzaController {

    async create(req: Request, res: Response) {
        const {sabor, ingredientes, preco, promocao} = req.body

        try{

        } catch(error) {
            console.log(error);
            return res.status(500).json("erro interno!")        
        }
    }
}