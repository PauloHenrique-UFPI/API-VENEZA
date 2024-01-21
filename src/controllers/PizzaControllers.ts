import { Request, Response } from "express";
import { pizzaRepositorie } from "../repositories/PizzaRepositorie";

interface UploadedFile extends Express.Multer.File {
    firebaseUrl?: string;
  }

export class PizzaController {

    async create(req: Request, res: Response) {
        
        const { sabor, ingredientes, preco, promocao} = req.body
        const firebaseUrl = (req.file as UploadedFile)?.firebaseUrl ?? undefined;

        if (!sabor || !ingredientes || !preco || !promocao || !firebaseUrl) {
            return res.status(400).json({ message: "Todos os campos são obrigatorio"})
        }

        try {
            const novo = pizzaRepositorie.create({
                img: firebaseUrl,
                sabor: sabor,
                ingredientes: ingredientes,
                preco: preco,
                promocao: promocao
            })

            await pizzaRepositorie.save(novo);
            return res.json({
                message: "Pizza cadastrada com sucesso !"
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
        
        try{
            const result = await pizzaRepositorie.update(id, dadosParaAtualizar);

            if (result.affected === 0) {
            return res.status(404).json({ message: "Pizza não encontrada" });
            }

            if (imgT) {
                await pizzaRepositorie.update(id, { img: imgT });
            }
    

            return res.json({ message: "Pizza atualizada com sucesso" });
        } catch (error){
            console.log(error);
            return res.status(500).json({
            message: "erro interno",
            });
        }
    }

    async pizzas(req: Request, res: Response) {
        try {
            const novo = pizzaRepositorie.find();

            const pizza = await pizzaRepositorie.find();
            res.json({

                groups: pizza.map((pizza) => {
                    return {
                    ...pizza,
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

    async promocao(req: Request, res: Response) {
        try {
            const pizzas = await pizzaRepositorie.find({
                where: {
                    promocao: true
                }
            });
            console.log(pizzas)
            if (pizzas.length > 0) {
                res.json(pizzas);
            } else {
                res.status(404).json({ message: 'Nenhuma pizza em promoção encontrada' });
            }
            
            console.log(pizzas);
            
            if (pizzas.length > 0) {
                res.json(pizzas);
            } else {
                res.json({ message: 'Nenhuma pizza em promoção encontrada' });
            }
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "erro interno !"
            })
        }
    }


    async pizzaID(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        try {
            const Pizza = await pizzaRepositorie.findOne({ where: { id: id } });
            if (Pizza) {
                res.json(Pizza);
            } else {
                res.status(404).json({ message: 'Pizza não encontrada' });
            } 
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "erro interno !"
            })
        }
    }
}