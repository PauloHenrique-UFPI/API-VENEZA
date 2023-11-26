import { Request, Response } from "express";
import { pedidoRepositorie } from "../repositories/PedidoRepositorie"; 
import 'dotenv/config'


export class PedidoController {

    async create(req: Request, res: Response) {
        const { tipo, tamanho, complemento, preco, troco, endereco, nomeCliente, contato } = req.body

        if (!tipo || !tamanho || !complemento || !preco || !troco || !endereco || !nomeCliente || !contato ) {
            return res.status(400).json({ message: "Todos os campos são obrigatorios"})
        }

        try {
            const novo = pedidoRepositorie.create({
                tipo: tipo,
                tamanho: tamanho,
                complemento: complemento,
                preco: preco,
                troco: troco, 
                endereco: endereco,
                nomeCliente: nomeCliente,
                contato:contato
            })

            await pedidoRepositorie.save(novo);
            return res.json({
                message: "Pedido cadastrado com sucesso !"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "erro interno",
            });   
        }

    }

    async alter(req: Request, res: Response){
        const id  = parseInt(req.params.id, 10);
        const corpo = req.body
        
        try{
            const result = await pedidoRepositorie.update(id, corpo );

            if (result.affected === 0) {
            return res.status(404).json({ message: "Pedido não encontrado" });
            }

            return res.json({ message: "Pedido atualizado com sucesso" });
        } catch (error){
            console.log(error);
            return res.status(500).json({
            message: "erro interno",
            });
        }
    }
    
    async pedidos(req: Request, res: Response){
        
        try{
            const pedido = await pedidoRepositorie.find();
            res.json({

                groups: pedido.map((pedido) => {
                    return {
                    ...pedido,
                    }
                }),
              
            })
        } catch(error) {
            console.log(error);
            return res.status(500).json({message: "Erro no servidor"})
            
        }
    }

    async pedidoId(req: Request, res: Response){
        const id  = parseInt(req.params.id, 10);
        const pedido = await pedidoRepositorie.findOne({ where: { id: id } });
        if (pedido) {
            res.json(pedido);
        } else {
        
            res.status(404).json({ message: 'Pedido não encontrado' });
        } 
    }


    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const deleted = await pedidoRepositorie.delete({ id:id })
            if (deleted.affected === 0) {
            return res.status(404).json({ message: "Pedido não encontrado" })
            }
            return res.json({ message: "Pedido deletado" })
        }
        catch (error) {
          console.log(error);
          return res.status(500).json({
            message: "erro interno",
          });
        }
      }
}