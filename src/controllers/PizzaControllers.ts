import { Request, Response } from "express";
import { pizzaRepositorie } from "../repositories/PizzaRepositorie";
import { promocaoRepositorie } from "../repositories/PromocaoRepositorie";
import { Tamanho } from "../enums/tamanhosPizza";
import { Categoria } from "../enums/categoriasPizza";
import { bebidaRepositorie } from "../repositories/BebidaRepositorie";
interface UploadedFile extends Express.Multer.File {
    firebaseUrl?: string;
  }

export class PizzaController {

    async create(req: Request, res: Response) {
        console.log(req.body)
        // const { sabor, ingredientes, precos, categoria, promocoes } = req.body;
        // const firebaseUrl = (req.file as UploadedFile)?.firebaseUrl ?? undefined;

        // if (!sabor || !ingredientes || !precos || !categoria || !firebaseUrl) {
        //     return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        // }

        // if (!Object.values(Categoria).includes(categoria)) {
        //     return res.status(400).json({ message: 'Categoria inválida' });
        // }

        // let precosJson
        // if (typeof precos === 'string') {
        //     precosJson = JSON.parse(precos);
        // }else{
        //     precosJson = precos
        // }
        // for (const size of Object.values(Tamanho)) {
        //     if (!precosJson.hasOwnProperty(size)) {
        //         return res.status(400).json({ message: `Preço para o tamanho ${size} é obrigatório`, precosJson });
        //     }
        // }
        // try {
        //     const novaPizza = pizzaRepositorie.create({
        //         img: firebaseUrl,
        //         sabor: sabor,
        //         ingredientes: ingredientes,
        //         precos: precosJson,
        //         categoria: categoria
        //     });

        //     await pizzaRepositorie.save(novaPizza);

        //     if (promocoes && Array.isArray(promocoes)) {
        //         for (const promo of promocoes) {
        //             const { tamanho, precoPromocional, descricao } = promo;
        //             if (Object.values(Tamanho).includes(tamanho) && precoPromocional) {
        //                 const novaPromocao = promocaoRepositorie.create({
        //                     pizza: novaPizza,
        //                     tamanho,
        //                     precoPromocional,
        //                     descricao
        //                 });
        //                 await promocaoRepositorie.save(novaPromocao);
        //             }
        //         }
        //     }
        //     return res.status(201).json({
        //         message: "Pizza cadastrada com sucesso !"
        //     });

        // } catch (error) {
        //     console.log(error);
        //     return res.status(500).json({
        //       message: "erro interno",
        //     }); 
        // }
    }

    async alter(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        const {img, sabor, ingredientes, precos, categoria } = req.body;
    
        const imgT = (req.file as UploadedFile)?.firebaseUrl ?? undefined;
        
        try {
            const pizza = await pizzaRepositorie.findOne({ where: { id: id } });

            if (!pizza) {
                return res.status(404).json({ message: 'Pizza não encontrada' });
            }

            if (!sabor && !ingredientes && !precos && !categoria && !imgT) {
                return res.status(400).json({ message: "Nenhum dado para atualizar" });
            }
    
            //const updateValues: { [key: string]: any } = {};
            if (sabor) {
                pizza.sabor = sabor;
            }
            if (ingredientes) {
                pizza.ingredientes = ingredientes;
            }
            if (precos) {
                let precosJson
                if (typeof precos === 'string') {
                    precosJson = JSON.parse(precos);
                }else{
                    precosJson = precos
                }
                // Verifica se 'precos' possui todos os tamanhos necessários
                for (const size of Object.values(Tamanho)) {
                    if (!precosJson.hasOwnProperty(size)) {
                        return res.status(400).json({ message: `Preço para o tamanho ${size} é obrigatório` });
                    }
                }
                pizza.precos = precos;
            }
            if (categoria) {
                // Verifica se a categoria é válida
                if (!Object.values(Categoria).includes(categoria)) {
                    return res.status(400).json({ message: 'Categoria inválida' });
                }
                pizza.categoria = categoria;
            }

            if (imgT) {
                pizza.img = imgT;
            }
    
            const result = await pizzaRepositorie.update(id, pizza);
    
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

    async addPromocao(req: Request, res: Response){
        //const id = parseInt(req.params.id, 10);
        //const corpo = req.body;
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
                if (!tamanho || !precoPromocional || !descricao) {
                    return res.status(400).json({ message: "Em promoção de pizza os campos são obrigatorios: tamanho, preco e descrição"});
                }
                if (!pizza) {
                    return res.status(404).json({ message: 'Pizza não encontrada' });
                }
            }
            if (idBebida){
                bebida = await bebidaRepositorie.findOne({where: { id: idBebida }})
                if (!bebida) {
                    return res.status(404).json({ message: 'Bebida não encontrada' });
                }
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
                message: 'Promoção adicionada com sucesso à pizza',
                promocao: novaPromocao
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Erro interno ao adicionar promoção' });
        }
    }

    async promocao(req: Request, res: Response) {
        try {
            const promocoes = await promocaoRepositorie.find()
            if (promocoes.length > 0) {
                res.json(promocoes);
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
            await promocaoRepositorie.delete({id:id})
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