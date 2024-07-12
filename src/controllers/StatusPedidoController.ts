import { Request, Response } from "express";
import { pedidoRepositorie } from "../repositories/PedidoRepositorie"; 
import 'dotenv/config'
import { Local } from "../enums/localPedido";
import { StatusPedido } from "../enums/statusPedido";

export class StatusPedidoController{
    
    async aceitaPedido(req: Request, res: Response){
        const id  = parseInt(req.params.id, 10);
        const pedido = await pedidoRepositorie.findOne({where: {id:id}});
        try {
            if (!pedido){
                return res.status(404).json({ message: `Pedido com ID ${id} não encontrado`});
            }
            if (pedido.status != StatusPedido.PENDENTE){
                return res.status(404).json({ message: `Pedido com ID ${id} não está pendente`});
            }
            pedido.status = StatusPedido.ACEITO;
            await pedidoRepositorie.save(pedido);
            return res.status(404).json({ message: `Pedido com ID ${id}, ${pedido.status}`});
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
    
    async entregaPedido(req: Request, res: Response){
        const id  = parseInt(req.params.id, 10);
        const pedido = await pedidoRepositorie.findOne({where: {id:id}});
        try {
            if (!pedido){
                return res.status(404).json({ message: `Pedido com ID ${id} não encontrado`});
            }
            if (pedido.status != StatusPedido.ACEITO){
                return res.status(404).json({ message: `Pedido com ID ${id} não foi aceito`});
            }
            pedido.status = StatusPedido.ENTREGAR;
            await pedidoRepositorie.save(pedido);
            return res.status(404).json({ message: `Pedido com ID ${id}, ${pedido.status}`});
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
    
    async entregouPedido(req: Request, res: Response){
        const id  = parseInt(req.params.id, 10);
        const pedido = await pedidoRepositorie.findOne({where: {id:id}});
        try {
            if (!pedido){
                return res.status(404).json({ message: `Pedido com ID ${id} não encontrado`});
            }
            if (pedido.status != StatusPedido.ENTREGAR && pedido.local == Local.ENTREGA){
                return res.status(404).json({ message: `Pedido com ID ${id} não pode ser entregue antes de sair pra entrega`});
            }
            // if (pedido.local == Local.NO_LOCAL && pedido.status != StatusPedido.PENDENTE){
            //     return res.status(404).json({ message: `Pedido com ID ${id} não pode ser finalizado antes de sair pra entrega`});
            // }
            pedido.status = StatusPedido.ENTREGUE;
            await pedidoRepositorie.save(pedido);
            return res.status(404).json({ message: `Pedido com ID ${id}, ${pedido.status}`});
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
        
    async finalizaPedido(req: Request, res: Response){
        const id  = parseInt(req.params.id, 10);
        const pedido = await pedidoRepositorie.findOne({where: {id:id}});
        try {
            if (!pedido){
                return res.status(404).json({ message: `Pedido com ID ${id} não encontrado`});
            }
            if (pedido.status != StatusPedido.ENTREGUE){
                return res.status(404).json({ message: `Pedido com ID ${id} não ser finalizado antes de ser entregue`});
            }
            pedido.status = StatusPedido.FINALIZADO;
            await pedidoRepositorie.save(pedido);
            return res.status(404).json({ message: `Pedido com ID ${id}, ${pedido.status}`});
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
        
    async cancelaPedido(req: Request, res: Response){
        const id  = parseInt(req.params.id, 10);
        const pedido = await pedidoRepositorie.findOne({where: {id:id}});
        try {
            if (!pedido){
                return res.status(400).json({ message: `Pedido com ID ${id} não encontrado`});
            }
            pedido.status = StatusPedido.CANCELADO;
            await pedidoRepositorie.save(pedido);
            return res.status(200).json({ message: `Pedido com ID ${id} ${pedido.status}`});
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
}