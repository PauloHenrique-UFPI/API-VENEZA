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

        const boolValor = JSON.parse(promocao.toLowerCase());
        try {
            const novo = pizzaRepositorie.create({
                img: firebaseUrl,
                sabor: sabor,
                ingredientes: ingredientes,
                preco: preco,
                promocao: boolValor
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
                const boolValor = JSON.parse(promocao.toLowerCase());
                updateValues.promocao = boolValor;
            }
    
            const result = await pizzaRepositorie.update(id, updateValues);
    
            if (result.affected === 0) {
                return res.status(404).json({ message: "Pizza não encontrada" });
            }
    
            return res.json({ message: "Pizza atualizada com sucesso" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }

    async pizzas(req: Request, res: Response) {
        try {
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
            if (pizzas.length > 0) {
                res.json(pizzas);
            } else {
                res.status(404).json({ message: 'Nenhuma pizza em promoção encontrada' });
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

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const deleted = await pizzaRepositorie.delete({ id:id })
            if (deleted.affected === 0) {
            return res.status(404).json({ message: "Pizza não encontrada" })
            }
            return res.json({ message: "Pizza deletada" })
        }
        catch (error) {
          console.log(error);
          return res.status(500).json({
            message: "erro interno",
          });
        }
      }
}