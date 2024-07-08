import { Request, Response } from "express";
import { Tamanho } from "../enums/tamanhosPizza";
import { promocaoRepositorie } from "../repositories/PromocaoRepositorie";
import { pizzaRepositorie } from "../repositories/PizzaRepositorie";
import { getRepository } from "typeorm";
import { bebidaRepositorie } from "../repositories/BebidaRepositorie";

export class PromocaoController{
    async createPromocao(req: Request, res: Response){
        const { tamanho, precoPromocional, descricao, idBebida, idPizza } = req.body;
        
        let pizza = undefined;
        let bebida = undefined;
        // Verifica se a pizza ou bebida existe
        if (!idBebida && !idPizza){
            return res.status(400).json({ message: "É necessário o id de pizza ou bebida"});
        }

        try {
            if (idPizza) {
                pizza = await pizzaRepositorie.findOne({where: { id: idPizza }});
                if (!tamanho || !precoPromocional) {
                    return res.status(400).json({ message: "Em promoção de pizza os campos são obrigatorios: tamanho e preco"});
                }
                if (!pizza) {
                    return res.status(404).json({ message: 'Pizza não encontrada' });
                }
            }
            if (idBebida){
                bebida = await bebidaRepositorie.findOne({where: { id: idBebida }})
                if (!bebida && !precoPromocional){
                    return res.status(400).json({ message: "Em promoção de bebida os campos são obrigatorios: preco e descrição"});
                }
                if (!bebida) {
                    return res.status(404).json({ message: 'Bebida não encontrada' });
                }
            }
            if (idBebida && idPizza && (!precoPromocional || !tamanho)){
                return res.status(400).json({ message: "Em promoção de combo os campos são obrigatorios: preco e tamanho"});
            }
            if (pizza && tamanho && !Object.values(Tamanho).includes(tamanho)) {
                return res.status(400).json({ message: 'Tamanho inválido' });
            }

            // Cria a nova promoção
            const novaPromocao = promocaoRepositorie.create({
                pizza: pizza,
                bebida: bebida,
                tamanho: tamanho,
                precoPromocional: precoPromocional,
                descricao: descricao
            });

            await promocaoRepositorie.save(novaPromocao);

            return res.status(201).json({
                message: 'Promoção adicionada com sucesso à pizza'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro interno ao adicionar promoção' });
        }
    }

    async todasPromocao(req: Request, res: Response) {
        try {
            const promocoes = await promocaoRepositorie.find({
                relations: [
                    "pizza",
                    "bebida",
                ]
            })
            const response = promocoes.map(promocao => ({
                id: promocao.id,
                pizza: promocao.pizza ? {
                    id: promocao.pizza.id,
                    sabor: promocao.pizza.sabor,
                    categoria: promocao.pizza.categoria
                }: null,
                bebida: promocao.bebida ? {
                    id: promocao.bebida.id
                }: null,
                preco: promocao.precoPromocional,
                tamanho: promocao.tamanho,
                descricao: promocao.descricao
            }));
            if (promocoes.length > 0) {
                return res.json(response);
            } else {
                return res.status(404).json({ message: 'Nenhuma pizza em promoção encontrada' });
            }   
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "erro interno !"
            })
        }
    }

    async unicaPromocao(req: Request, res: Response){
        const id = parseInt(req.params.id, 10);
        const promocaoAtual = await promocaoRepositorie.findOne({where: {pizza: {id:id}}});
        try {
            if (!promocaoAtual){
                return res.status(404).json({ message: 'Não tem promoção ativa para esse ID' });
            }else{
                console.log(promocaoAtual)
                return res.json(promocaoAtual);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "erro interno !"
            })
        }
    }

    async deletePromocao(req: Request, res: Response){
        const id = parseInt(req.params.id, 10);
        console.log("meeeeeeeeee")
        const promocaoAtual = await promocaoRepositorie.findOne({where:{id:id}});
        try {
            // console.log(promocaoAtual)
            if (!promocaoAtual){
                return res.status(404).json({ message: 'Não tem promoção ativa para esse ID' });
            }
            await promocaoRepositorie.delete(promocaoAtual)
            return res.status(200).json({ message: "Promoção deletada com sucesso"})
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "erro interno !"
            })
        }
    }

    async alterPromocao(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        const { idPizza, idBebida, tamanho, preco, descricao } = req.body;
    
        if (!idPizza && !idBebida && !tamanho && !preco && !descricao) {
            return res.status(400).json({ message: "Nenhum dado para atualizar" });
        }
        if (!idPizza && !idBebida){
            return res.status(400).json({ message: "É necessário adicionar uma pizza ou bebina na promoção" });
        }
        try { 
            const promocao = await promocaoRepositorie.findOneBy({ id });
    
            if (!promocao) {
                return res.status(404).json({ message: "Promoção não encontrada" });
            }
            if (idPizza) {
                if (!tamanho && !preco && !descricao){
                    return res.status(400).json({ message: "Para adicionar promoção de pizza os seguintes campos são obrigatórios: tamanho, descrição, preço" });
                }
                const pizzaAtual = await pizzaRepositorie.findOneBy({ id: idPizza });
                if (!pizzaAtual) {
                    return res.status(404).json({ message: "Pizza não encontrada" });
                }
                promocao.pizza = pizzaAtual;
            }
            if (idBebida) {
                const bebidaAtual = await bebidaRepositorie.findOneBy({ id: idBebida });
                if (!bebidaAtual) {
                    return res.status(404).json({ message: "Bebida não encontrada" });
                }
                promocao.bebida = bebidaAtual;
            }
            if (tamanho) {
                if (!Object.values(Tamanho).includes(tamanho)) {
                    return res.status(400).json({ message: "Tamanho inválido", Tamanho });
                }
                promocao.tamanho = tamanho;
            }
            if (preco) {
                promocao.precoPromocional = preco;
            }
            if (descricao) {
                promocao.descricao = descricao;
            }
    
            await promocaoRepositorie.save(promocao);
    
            return res.status(200).json({ message: "Promoção atualizada com sucesso", promocao });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro interno" });
        }
    }
    

}