import { Request, Response } from "express";
import { bordaRepositorie } from "../repositories/BordaRepositorie";
import { ingredienteAdicionalRepositorie } from "../repositories/IngredienteAdicional";

export class BordaController{
    
    async createBorda(req: Request, res: Response){
        const { nome, preco } = req.body;

        if (!nome || !preco){
            console.log(nome)
            console.log(preco)
            return res.status(400).json({message: "Nome e preco são obrigatórios."})
        }
        try{

            const novaBorda = bordaRepositorie.create({
                nome: nome,
                preco: preco
            })
            await bordaRepositorie.save(novaBorda)
            return res.status(200).json({message: "Borda cadastrada com sucesso"})
        }catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "erro interno",
            });   
        }
    }

    async getAllBordas(req: Request, res: Response) {
        try {
            const bordas = await bordaRepositorie.find();
            res.json({
                groups: bordas.map((bordas) => {
                    return {
                    ...bordas,
                    }
                }),
            })
            // return res.status(200).json(bordas);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno" });
        }
    }

    async getBorda(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        try {
            const borda = await bordaRepositorie.find({where: {id:id}});
            if (borda.length > 0){
                return res.status(200).json(borda);
            }else{
                return res.status(400).json({message: "Borda não encontrada"});
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno" });
        }
    }

    async alterBorda(req: Request, res: Response) {
        const { ...dadosBorda } = req.body;
        const id = parseInt(req.params.id, 10);
    
        if (Object.keys(dadosBorda).length === 0) {
            return res.status(400).json({ message: "Nenhum dado para atualizar" });
        }
    
        try {
            const borda = await bordaRepositorie.findOne({ where: { id: id } });
    
            if (!borda) {
                return res.status(404).json({ message: "Borda não encontrada" });
            }
    
            await bordaRepositorie.update(id, dadosBorda);
            return res.status(200).json({ message: "Borda atualizada com sucesso" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno" });
        }
    }

    async deleteBorda(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id,10);
            const borda = bordaRepositorie.findOne({where: {id:id}});
            if (!borda){
                return res.status(400).json({message: "Borda não encontrada"})
            }else{
                await bordaRepositorie.delete({id:id})
            }
            return res.status(200).json({message: "Borda deletada com sucesso"})
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "erro interno",
            });  
        }
    }

}

export class IngredienteAdicionalController{
    async createIngredienteAdicional(req: Request, res: Response){
        const { nome, preco } = req.body;
        if (!nome || !preco){
            return res.status(400).json({message: "Nome e preco são obrigatórios."})
        }
        try {
            const novoIngrediente = ingredienteAdicionalRepositorie.create({
                nome: nome,
                preco:preco
            })
            await ingredienteAdicionalRepositorie.save(novoIngrediente)
            return res.status(200).json({message: "Ingrediente criado com sucesso"})
        } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "erro interno",
            });  
        }

    }
    async getAllIngredientes(req: Request, res: Response) {
        try {
            const ingrediente = await ingredienteAdicionalRepositorie.find();
            res.json({
                groups: ingrediente.map((ingrediente) => {
                    return {
                    ...ingrediente,
                    }
                }),
            })
            // return res.status(200).json(ingrediente);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno" });
        }
    }

    async getIngrediente(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        try {
            const ingrediente = await ingredienteAdicionalRepositorie.find({where: {id:id}});
            if (ingrediente.length > 0){
                return res.status(200).json(ingrediente);
            }else{
                return res.status(400).json({message: "Ingrediente não encontrado"});
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno" });
        }
    }

    async alterIngrediente(req: Request, res: Response){
        const {...dadosIngrediente} = req.body;
        const id = parseInt(req.params.id, 10);
        if (Object.keys(dadosIngrediente).length === 0) {
            return res.status(400).json({ message: "Nenhum dado para atualizar" });
        }
        const ingrediente = bordaRepositorie.findOne({where: {id:id}})
        if (!ingrediente){
            return res.status(400).json({ message: "Ingrediente não encontrado" });
        }
        try {
            if (Object.keys(dadosIngrediente).length > 0) {
                await ingredienteAdicionalRepositorie.update(id, dadosIngrediente);
                return res.status(200).json({ message: "Ingrediente atualizado com sucesso"})
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "erro interno",
            }); 
        }
    }

    async deleteIngrediente(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id,10);
            const ingrediente = ingredienteAdicionalRepositorie.findOne({where: {id:id}});
            if (!ingrediente){
                return res.status(400).json({message: "Ingrediente adicional não encontrado"})
            }else{
                await ingredienteAdicionalRepositorie.delete({id:id})
            }
            return res.status(200).json({message: "Ingrediente deletado com sucesso"})
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "erro interno",
            });  
        }
    }

}