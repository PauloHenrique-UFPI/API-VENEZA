import { Request, Response } from "express";
import { bebidaRepositorie } from "../repositories/BebidaRepositorie";
interface UploadedFile extends Express.Multer.File {
    firebaseUrl?: string;
}

export class BebidaController {
    
    async create(req: Request, res: Response) {
        const { nome, litros, preco, promocao } = req.body;
        const img = (req.file as UploadedFile)?.firebaseUrl ?? undefined;

        if ( !nome || !litros || !preco || !promocao || !img ){
            return res.status(400).json({ message: "Todos os campos são obrigatorios"})
        }

        try {
            const novo = bebidaRepositorie.create({
                nome: nome,
                litros: litros,
                preco: preco,
                promocao: promocao,
                img: img
            })

            await bebidaRepositorie.save(novo);
            return res.status(201).json({
                message: "Bebida cadastrada com sucesso !"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "erro interno",
            });
        }
    }

    async alter(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        const corpo = req.body;
        const { img, promocao, ...dadosParaAtualizar } = corpo;
    
        const imgT = (req.file as UploadedFile)?.firebaseUrl ?? undefined;
        
        try {
            if (Object.keys(dadosParaAtualizar).length === 0 && !imgT && !promocao) {
                return res.status(400).json({ message: "Nenhum dado para atualizar" });
            }
    
            const updateValues: { [key: string]: any } = {};
            if (Object.keys(dadosParaAtualizar).length > 0) {
                Object.assign(updateValues, dadosParaAtualizar);
            }
            if (imgT) {
                updateValues.img = imgT;
            }
            if (promocao) {
                updateValues.promocao = JSON.parse(promocao.toLowerCase());;
            }
    
            const result = await bebidaRepositorie.update(id, updateValues);
    
            if (result.affected === 0) {
                return res.status(404).json({ message: "Bebida não encontrada" });
            }
    
            return res.json({ message: "Bebida atualizada com sucesso" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }

    async bebidas(req: Request, res: Response) {
        try {
            const bebida = await bebidaRepositorie.find();
            res.json({
                groups: bebida.map((bebida) => {
                    return {
                    ...bebida,
                    }
                }),
            })
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                message: "erro interno!"
            })
        }
    }

    async bebidaID(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        try {
            const bebida = await bebidaRepositorie.findOne({ where: { id: id } });
            if (bebida) {
                res.json(bebida);
            } else {
                res.status(404).json({ message: 'Bebida não encontrada' });
            } 
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "erro interno !"
            })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const deleted = await bebidaRepositorie.delete({ id:id })
            if (deleted.affected === 0) {
            return res.status(404).json({ message: "Bebida não encontrada" })
            }
            return res.json({ message: "Bebida deletada" })
        }
        catch (error) {
          console.log(error);
          return res.status(500).json({
            message: "erro interno",
          });
        }
      }
}
