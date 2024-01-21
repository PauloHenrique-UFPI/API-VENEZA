import { Request, Response } from "express";
import { pedidoRepositorie } from "../repositories/PedidoRepositorie"; 
import 'dotenv/config'

interface UploadedFile extends Express.Multer.File {
    firebaseUrl?: string;
  }

export class PedidoController {

    async create(req: Request, res: Response) {
        const { qtd ,tipo, tamanho, complemento, preco, troco, endereco, nomeCliente, contato, status } = req.body
        const firebaseUrl = (req.file as UploadedFile)?.firebaseUrl ?? undefined;

        if (!qtd || !tipo || !tamanho || !complemento || !preco || !troco || !endereco || !nomeCliente || !contato || !status ) {
            console.log(req.body)
            return res.status(400).json({ message: "Todos os campos são obrigatorios"})
        }
        

        try {
            const novo = pedidoRepositorie.create({
                qtd: qtd,
                tipo: tipo,
                tamanho: tamanho,
                complemento: complemento,
                preco: preco,
                troco: troco, 
                endereco: endereco,
                nomeCliente: nomeCliente,
                contato:contato,
                status: status,
                img: firebaseUrl
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
        const { img, ...dadosParaAtualizar } = corpo;

        const imgT = (req.file as UploadedFile)?.firebaseUrl ?? undefined;
        
        try {
            if (Object.keys(dadosParaAtualizar).length === 0 && !imgT) {
                return res.status(400).json({ message: "Nenhum dado para atualizar" });
            }
    
            const updateValues: { [key: string]: any } = {};
            if (Object.keys(dadosParaAtualizar).length > 0) {
                Object.assign(updateValues, dadosParaAtualizar);
            }
            if (imgT) {
                updateValues.img = imgT;
            }
    
            const result = await pedidoRepositorie.update(id, updateValues);
    
            if (result.affected === 0) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }
    
            return res.json({ message: "Pedido atualizado com sucesso" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
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