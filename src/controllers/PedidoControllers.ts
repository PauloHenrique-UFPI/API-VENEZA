import { Request, Response } from "express";
import { pedidoRepositorie } from "../repositories/PedidoRepositorie"; 
import 'dotenv/config';
import { userRepositorie } from "../repositories/UsuarioRepositorie";
import { pizzaRepositorie } from "../repositories/PizzaRepositorie";
import { bordaRepositorie } from "../repositories/BordaRepositorie";
import { ingredienteAdicionalRepositorie } from "../repositories/IngredienteAdicional";
import { pedidoPizzaRepositorie } from "../repositories/PedidoPizzaRepositorie";
import { IngredienteAdicional } from "../entities/IngredienteAdicional";
import { Usuario } from "../entities/Usuario";
import { Local } from "../enums/localPedido";
import { Tamanho } from "../enums/tamanhosPizza";
import { bebidaRepositorie } from "../repositories/BebidaRepositorie";
import { promocaoRepositorie } from "../repositories/PromocaoRepositorie";
import { StatusPedido } from "../enums/statusPedido";
import { FormaPagamento } from "../enums/formaPagamento";
import { enderecoUsuarioRepositorie } from "../repositories/UsuarioTipoRepositorie";

// interface UploadedFile extends Express.Multer.File {
//     firebaseUrl?: string;
//   }

export class PedidoController {

    async create(req: Request, res: Response) {
        const { pizzas, bebidas, idUsuario, local, descricao, formaPagamento, valor, idEndereco } = req.body
        // const firebaseUrl = (req.file as UploadedFile)?.firebaseUrl ?? undefined;

        if (!pizzas || !bebidas || !idUsuario || !local || !formaPagamento) {
            console.log(req.body)
            return res.status(400).json({ message: "Todos os campos são obrigatorios"})
        }
        const endereco = await enderecoUsuarioRepositorie.findOne({ where: { id: idEndereco, usuario: { id: idUsuario } } });
        if (!endereco && local == Local.ENTREGA) {
            return res.status(404).json({ message: "Endereço não encontrado!" });
        }

        const usuario = await userRepositorie.findOne({where: { id :parseInt( idUsuario, 10)}});
        if (!usuario) {
            return res.status(404).json({ message: `Usuário com ID ${idUsuario} não encontrado` });
        }

        if (!Object.values(Local).includes(local)){
            return res.status(400).json({ message: 'Local inválido' });
        }
        if (!Object.values(FormaPagamento).includes(formaPagamento)){
            return res.status(400).json({ message: 'Forma de pagamento inválida' });
        }
        // if (!Object.values(Categoria).includes(categoria)) {
        //     return res.status(400).json({ message: 'Categoria inválida' });
        // }

        let precoTotalPedido = 0;
        const pedidoPizzas = [];

        type TamanhoPizza = 'P' | 'M' | 'G' | 'GG';
        for (const pizzaData of pizzas) {
            const { pizzaIds, bordaId, ingredientesAdicionaisIds, tamanho } = pizzaData;
            
            let precoTotalPizza = 0;
            // if (!pizzaIds){
            //     return res.status(404).json(pizzaIds );
            // }
            for (const pizzaId of pizzaIds) {
                const pizzaAtual = await pizzaRepositorie.findOne({where: {id:pizzaId}});
                if (!pizzaAtual) {
                    return res.status(404).json({ message: `Pizza com ID ${pizzaId} não encontrada` });
                }
                const promo = await promocaoRepositorie.findOne({where: { pizza: { id: pizzaId } }})
                if (pizzaAtual.precos[tamanho as TamanhoPizza] !== undefined) {
                    if ( promo && promo.tamanho == tamanho){
                        // console.log("Pizza na promoção")
                        precoTotalPizza += (promo.precoPromocional)/ pizzaIds.length;
                    }else{
                        precoTotalPizza += (pizzaAtual.precos[tamanho as TamanhoPizza])/ pizzaIds.length;
                    }
                } else {
                    return res.status(400).json({ message: `Tamanho '${tamanho}' não é válido para esta pizza` });
                }
            }

            let borda = undefined;
            if (bordaId) {
                borda = await bordaRepositorie.findOne({where: {id:bordaId}});
                if (!borda) {
                    return res.status(404).json({ message: `Borda com ID ${bordaId} não encontrada` });
                }
            }

            // Calcular o preço total (preço da borda + preço dos ingredientes adicionais)
            if (borda) {
                precoTotalPizza += borda.preco;
            }
            let ingredientesAdicionais: IngredienteAdicional[] = [];
            if (ingredientesAdicionaisIds && ingredientesAdicionaisIds.length > 0) {
                ingredientesAdicionais = await ingredienteAdicionalRepositorie.findByIds(ingredientesAdicionaisIds);
            }

            precoTotalPedido += precoTotalPizza;
            const sabores = pizzaIds.map((id: number) => ({ id }));

            const pedidoPizza = pedidoPizzaRepositorie.create({
                sabores: sabores,
                borda: borda,
                ingredientesAdicionais: ingredientesAdicionais,
                precoTotal: precoTotalPizza,
                tamanho: tamanho,
            });

            pedidoPizzas.push(pedidoPizza);
        }
        if (bebidas.length > 0 ){
            for (const bebida of bebidas){
                const bebidaAtual = await bebidaRepositorie.findOne({where: {id:bebida}})
                if (!bebidaAtual){
                    return res.status(404).json({ message: `Bebida com ID ${bebida} não encontrada` });
                }
                const promoBebida = await promocaoRepositorie.findOne({where: { pizza: { id: bebida } }})
                if (!promoBebida){
                    precoTotalPedido += bebidaAtual.preco;
                }else{
                    // console.log("Bebida na promoção");
                    if (promoBebida.pizza && pedidoPizzas[promoBebida.pizza.id]){
                        // console.log('Bedida ja adicionada pois esta em combo')
                    }else{
                        precoTotalPedido += promoBebida.precoPromocional;
                    }
                }
            }
        }
        if (endereco){
            const bairo = endereco.bairo;
            if (bairo){
                precoTotalPedido += bairo.taxaEntrega
            }
        }
        // console.log("Taxa")
        // if (Local.ENTREGA == local && endereco?.bairo.taxaEntrega != undefined){
        //     precoTotalPedido += endereco?.bairo.taxaEntrega;
        // }
        // console.log("Entrega")
        try {
            const bebidas2 = bebidas.map((id: number) => ({ id }))
            const novoPedido = pedidoRepositorie.create({
                status: StatusPedido.CARRINHO,
                precoTotal: precoTotalPedido,
                pizzas: pedidoPizzas,
                bebidas: bebidas2,
                usuario: usuario,
                local: local,
                descricao: descricao,
                FormaPagamento: formaPagamento,
                enderecoEntrega: idEndereco
            })
            if (FormaPagamento.DINHEIRO == formaPagamento){
                if (valor){
                    novoPedido.troco = valor - precoTotalPedido;
                    if (novoPedido.troco < 0 ){
                        return res.status(400).json({ message: `Valor pago é insuficinente; valor a pagar: ${valor}; preço total: ${precoTotalPedido}` });    
                    }
                }else{
                    return res.status(400).json({ message: `Pedido pago em dinheiro deve possuir o valor a pagar` });
                }
            }
            
            // console.log(novoPedido)
            const novoCarrinho = await pedidoRepositorie.save(novoPedido);
            return res.json({
                message: "Pedido cadastrado com sucesso !",
                novoCarrinho
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "erro interno",
            });   
        }

    }

    async addPizzaCarrinho(req: Request, res: Response){
        const id = parseInt(req.params.id, 10);
        const {pizzas} = req.body;
        
        const pedido = await pedidoRepositorie.findOne({ where: { id: id }, relations: ["pizzas", "bebidas"] });
        if (pedido?.status != StatusPedido.CARRINHO){
            return res.status(404).json({ message: `Pedido com ID ${id} não esta no carrinho` });
        }
        if (!pedido) {
            return res.status(404).json({ message: `Pedido com ID ${id} não encontrado` });
        }
        const promo = await promocaoRepositorie.findOne({where: {pizza: {id:id}}})
        try {
    
    
            if (!pedido) {
                return res.status(404).json({ message: `Carrinho com ID ${id} não encontrado` });
            }
    
            // Se houver pizzas para atualizar
            if (pizzas) {
    
                // Adiciona as novas pizzas ao pedido
                for (const pizzaData of pizzas) {
                    const { pizzaIds, bordaId, ingredientesAdicionaisIds, tamanho } = pizzaData;
    
                    let precoTotalPizza = 0;
    
                    for (const pizzaId of pizzaIds) {
                        const pizza = await pizzaRepositorie.findOne({ where: { id: pizzaId } });
                        if (!pizza) {
                            return res.status(404).json({ message: `Pizza com ID ${pizzaId} não encontrada` });
                        }
    
                        if (pizza.precos[tamanho as Tamanho] !== undefined) {
                            precoTotalPizza += pizza.precos[tamanho as Tamanho] / pizzaIds.length;
                        } else {
                            return res.status(400).json({ message: `Tamanho '${tamanho}' não é válido para esta pizza` });
                        }
                    }
    
                    // Busca a borda, se houver
                    let borda = undefined;
                    if (bordaId) {
                        borda = await bordaRepositorie.findOne(bordaId);
                        if (!borda) {
                            return res.status(404).json({ message: `Borda com ID ${bordaId} não encontrada` });
                        }
                        // Adiciona o preço da borda ao total da pizza
                        precoTotalPizza += borda.preco;
                    }
    
                    // Busca os ingredientes adicionais, se houver
                    let ingredientesAdicionais: IngredienteAdicional[] = [];
                    if (ingredientesAdicionaisIds && ingredientesAdicionaisIds.length > 0) {
                        ingredientesAdicionais = await ingredienteAdicionalRepositorie.findByIds(ingredientesAdicionaisIds);
                    }
    
                    // Cria a entidade PedidoPizza e a associa ao pedido com as informações atualizadas
                    const pedidoPizza = pedidoPizzaRepositorie.create({
                        sabores: pizzaIds.map((id: number) => ({ id })),
                        borda: borda,
                        ingredientesAdicionais: ingredientesAdicionais,
                        precoTotal: precoTotalPizza,
                        tamanho: tamanho // Adicione o tamanho aqui
                    });
                    //Adiciona o preco da pizza
                    pedido.pizzas.push(pedidoPizza);
                    //Adicionar o preco da pizza no pedido
                    pedido.precoTotal += precoTotalPizza;
                }
            }
            // Salva o pedidoPizza com as novas bebidas e pizzas
            const carrinho = await pedidoRepositorie.save(pedido);
    
            return res.json({ message: "Pedido atualizado com sucesso",carrinho });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }

    async aprovarCarrinho(req: Request, res: Response){
        const id = parseInt(req.params.id, 10);

        const pedido = await pedidoRepositorie.findOne({ where: { id: id }, relations: ["pizzas", "bebidas"] });

        if (pedido?.status != StatusPedido.CARRINHO){
            return res.status(404).json({ message: `Pedido com ID ${id} não está no carrinho` });
        }
        try {
            pedido.status = StatusPedido.PENDENTE;
            pedido.dataHora = new Date()
            await pedidoRepositorie.save(pedido);
    
            return res.json({ message: "Pedido atualizado com sucesso" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }

    async alter(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        const corpo = req.body;
        const { pizzas, bebidas, ...dadosParaAtualizar } = corpo;
    
        try {
            if (Object.keys(dadosParaAtualizar).length === 0 && !bebidas && !pizzas) {
                return res.status(400).json({ message: "Nenhum dado para atualizar" });
            }
    
            const pedido = await pedidoRepositorie.findOne({ where: { id: id }, relations: ["pizzas", "bebidas"] });
    
            if (!pedido) {
                return res.status(404).json({ message: `Pedido com ID ${id} não encontrado` });
            }
    
            // Atualiza os campos simples diretamente
            if (Object.keys(dadosParaAtualizar).length > 0) {
                await pedidoRepositorie.update(id, dadosParaAtualizar);
            }
    
            // Se houver pizzas para atualizar
            if (pizzas) {
                // Remove as pizzas existentes no pedido
                pedido.pizzas = [];
    
                // Adiciona as novas pizzas ao pedido
                for (const pizzaData of pizzas) {
                    const { pizzaIds, bordaId, ingredientesAdicionaisIds, tamanho } = pizzaData;
    
                    let precoTotalPizza = 0;
    
                    for (const pizzaId of pizzaIds) {
                        const pizza = await pizzaRepositorie.findOne({ where: { id: pizzaId } });
                        if (!pizza) {
                            return res.status(404).json({ message: `Pizza com ID ${pizzaId} não encontrada` });
                        }
    
                        if (pizza.precos[tamanho as Tamanho] !== undefined) {
                            precoTotalPizza += pizza.precos[tamanho as Tamanho] / pizzaIds.length;
                        } else {
                            return res.status(400).json({ message: `Tamanho '${tamanho}' não é válido para esta pizza` });
                        }
                    }
    
                    // Busca a borda, se houver
                    let borda = undefined;
                    if (bordaId) {
                        borda = await bordaRepositorie.findOne(bordaId);
                        if (!borda) {
                            return res.status(404).json({ message: `Borda com ID ${bordaId} não encontrada` });
                        }
                        // Adiciona o preço da borda ao total da pizza
                        precoTotalPizza += borda.preco;
                    }
    
                    // Busca os ingredientes adicionais, se houver
                    let ingredientesAdicionais: IngredienteAdicional[] = [];
                    if (ingredientesAdicionaisIds && ingredientesAdicionaisIds.length > 0) {
                        ingredientesAdicionais = await ingredienteAdicionalRepositorie.findByIds(ingredientesAdicionaisIds);
                    }
    
                    // Cria a entidade PedidoPizza e a associa ao pedido com as informações atualizadas
                    const pedidoPizza = pedidoPizzaRepositorie.create({
                        sabores: pizzaIds.map((id: number) => ({ id })),
                        borda: borda,
                        ingredientesAdicionais: ingredientesAdicionais,
                        precoTotal: precoTotalPizza,
                        tamanho: tamanho // Adicione o tamanho aqui
                    });
    
                    pedido.pizzas.push(pedidoPizza);
                }
            }
    
            // Se houver bebidas para atualizar
            if (bebidas) {
                // Remove as bebidas existentes no pedido
                pedido.bebidas = [];
    
                // Adiciona as novas bebidas ao pedido, permitindo duplicatas
                for (const bebidaId of bebidas) {
                    const bebida = await bebidaRepositorie.findOne({ where: { id: bebidaId } });
                    if (bebida) {
                        pedido.bebidas.push(bebida);
                    }
                }
            }
    
            // Salva o pedido com as novas bebidas e pizzas
            await pedidoRepositorie.save(pedido);
    
            return res.json({ message: "Pedido atualizado com sucesso" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno",
            });
        }
    }
    
    async pedidos(req: Request, res: Response){
        
        try {
            // Encontra todos os pedidos e carrega suas relações
            const pedidos = await pedidoRepositorie.find({
                relations: [
                    "pizzas",
                    "pizzas.sabores",
                    "pizzas.borda",
                    "pizzas.ingredientesAdicionais",
                    "bebidas",
                    "usuario"
                ]
            });

            // Formata a resposta para incluir as informações necessárias
            const response = pedidos.map(pedido => ({
                id: pedido.id, // Retorna o id do pedido
                dataHora: pedido.dataHora,
                status: pedido.status, // Retorna o status do pedido
                precoTotal: pedido.precoTotal, // Retorna o preco total de todas as pizzas e bebidas do pedido
                FormaPagamento: pedido.FormaPagamento,
                troco: pedido.troco,
                local: pedido.local,
                endereco: pedido.enderecoEntrega,
                taxaEntrega: pedido.enderecoEntrega.bairo ? {
                    bairro: pedido.enderecoEntrega.bairo.nome,
                    taxaEntrega: pedido.enderecoEntrega.bairo.taxaEntrega
                }: null,
                descricao: pedido.descricao,
                usuario: pedido.usuario ? {
                    id: pedido.usuario.id,
                    email: pedido.usuario.email
                    // endereco: pedido.usuario.endereco,
                    // cep: pedido.usuario.cep
                } : null,
                //usuario: pedido.usuario ? { id: pedido.usuario.id, nome: pedido.usuario.nome } : null,
                pizzas: pedido.pizzas.map(pedidoPizza => ({ // Retorna as pizzas do pedido
                    id: pedidoPizza.id, // Retorna o id da pizza
                    precoTotal: pedidoPizza.precoTotal,
                    tamanho: pedidoPizza.tamanho,
                    sabores: pedidoPizza.sabores.map(sabor => ({ // Retorna os sabores dessa pizza
                        id: sabor.id, // Retorna o id do sabor
                        //img: sabor.img,
                        sabor: sabor.sabor,
                        //ingredientes: sabor.ingredientes,
                        //precos: sabor.precos,
                        categoria: sabor.categoria
                    })),
                    borda: pedidoPizza.borda ? {
                        id: pedidoPizza.borda.id,
                        nome: pedidoPizza.borda.nome,
                        preco: pedidoPizza.borda.preco
                    } : null,
                    ingredientesAdicionais: pedidoPizza.ingredientesAdicionais.map(ingrediente => ({
                        id: ingrediente.id,
                        nome: ingrediente.nome,
                        preco: ingrediente.preco
                    }))
                })),
                bebidas: pedido.bebidas.map(bebida => ({
                    id: bebida.id,
                    nome: bebida.nome,
                    preco: bebida.preco
                }))
            }));

            // Retorna a resposta formatada
            res.json({ groups: response });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Erro interno ao buscar pedidos"
            });
        }
    }

    async pedidoId(req: Request, res: Response){
        const id  = parseInt(req.params.id, 10);
        const pedido = await pedidoRepositorie.findOne({ 
            where: { id: id },
            relations: [
                "pizzas",
                "pizzas.sabores",
                "pizzas.borda",
                "pizzas.ingredientesAdicionais",
                "bebidas",
                "usuario"
            ]
        });
        const responsse = pedido ? {
            id: pedido.id,
            dataHora: pedido.dataHora,
            status: pedido.status,
            precoTotal: pedido.precoTotal,
            FormaPagamento: pedido.FormaPagamento,
            troco: pedido.troco,
            endereco: pedido.enderecoEntrega,
            taxaEntrega: pedido.enderecoEntrega.bairo ? {
                bairro: pedido.enderecoEntrega.bairo.nome,
                taxaEntrega: pedido.enderecoEntrega.bairo.taxaEntrega
            }: null,
            usuario: pedido.usuario ? {
                id: pedido.usuario.id
                // email: pedido.usuario.email,
                // endereco: pedido.usuario.endereco,
                // cep: pedido.usuario.cep,
            }: null,
            pizzas: pedido.pizzas.map(pedidoPizza => ({ // Retorna as pizzas do pedido
                id: pedidoPizza.id, // Retorna o id da pizza
                precoTotal: pedidoPizza.precoTotal,
                tamanho: pedidoPizza.tamanho,
                sabores: pedidoPizza.sabores.map(sabor => ({ // Retorna os sabores dessa pizza
                    id: sabor.id, // Retorna o id do sabor
                    //img: sabor.img,
                    sabor: sabor.sabor,
                    //ingredientes: sabor.ingredientes,
                    //precos: sabor.precos,
                    categoria: sabor.categoria
                })),
                borda: pedidoPizza.borda ? {
                    id: pedidoPizza.borda.id,
                    nome: pedidoPizza.borda.nome,
                    preco: pedidoPizza.borda.preco
                } : null,
                ingredientesAdicionais: pedidoPizza.ingredientesAdicionais.map(ingrediente => ({
                    id: ingrediente.id,
                    nome: ingrediente.nome,
                    preco: ingrediente.preco
                }))
            })),
            bebidas: pedido.bebidas.map(bebida => ({
                id: bebida.id,
                nome: bebida.nome,
                preco: bebida.preco
            }))
        } : null
        if (responsse) {
            res.json(responsse);
        } else {
        
            res.status(404).json({ message: 'Pedido não encontrado' });
        } 
    }

    async pedidosUsuarioId(req: Request, res: Response){
        const id = parseInt(req.params.id, 10);
        const pedidos = await pedidoRepositorie.find(
            {where: {usuario: {id:id}},
            relations: [
                "pizzas",
                "pizzas.sabores",
                "pizzas.borda",
                "pizzas.ingredientesAdicionais",
                "bebidas",
                "usuario"
            ]
        });
        try {
            if (!pedidos){
                return res.status(404).json({ message: `Não existem pedidos para o usuário de id ${id}` });
            }
            const response = pedidos.map(pedido => ({
                id: pedido.id, // Retorna o id do pedido
                dataHora: pedido.dataHora,
                status: pedido.status, // Retorna o status do pedido
                precoTotal: pedido.precoTotal, // Retorna o preco total de todas as pizzas e bebidas do pedido
                FormaPagamento: pedido.FormaPagamento,
                troco: pedido.troco,
                local: pedido.local,
                descricao: pedido.descricao,
                endereco: pedido.enderecoEntrega,
                taxaEntrega: pedido.enderecoEntrega.bairo ? {
                    bairro: pedido.enderecoEntrega.bairo.nome,
                    taxaEntrega: pedido.enderecoEntrega.bairo.taxaEntrega
                }: null,
                usuario: pedido.usuario ? {
                    id: pedido.usuario.id
                    // email: pedido.usuario.email,
                    // endereco: pedido.usuario.endereco,
                    // cep: pedido.usuario.cep
                } : null,
                //usuario: pedido.usuario ? { id: pedido.usuario.id, nome: pedido.usuario.nome } : null,
                pizzas: pedido.pizzas.map(pedidoPizza => ({ // Retorna as pizzas do pedido
                    id: pedidoPizza.id, // Retorna o id da pizza
                    precoTotal: pedidoPizza.precoTotal,
                    tamanho: pedidoPizza.tamanho,
                    sabores: pedidoPizza.sabores.map(sabor => ({ // Retorna os sabores dessa pizza
                        id: sabor.id, // Retorna o id do sabor
                        //img: sabor.img,
                        sabor: sabor.sabor,
                        //ingredientes: sabor.ingredientes,
                        //precos: sabor.precos,
                        categoria: sabor.categoria
                    })),
                    borda: pedidoPizza.borda ? {
                        id: pedidoPizza.borda.id,
                        nome: pedidoPizza.borda.nome,
                        preco: pedidoPizza.borda.preco
                    } : null,
                    ingredientesAdicionais: pedidoPizza.ingredientesAdicionais.map(ingrediente => ({
                        id: ingrediente.id,
                        nome: ingrediente.nome,
                        preco: ingrediente.preco
                    }))
                })),
                bebidas: pedido.bebidas.map(bebida => ({
                    id: bebida.id,
                    nome: bebida.nome,
                    preco: bebida.preco
                }))
            }));
            res.json({ groups: response });
        } catch (error) {
            console.log(error);
          return res.status(500).json({
            message: "erro interno",
          });
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const pedido = await pedidoRepositorie.findOne({where: {id:id}})
            if (!pedido){
                return res.status(404).json({ message: `Pedido com ID ${id} não encontrado` });
            }else{
                await pedidoPizzaRepositorie.delete({ pedido: { id: Number(id) } });

                await pedidoRepositorie.remove(pedido);
            }
            // const deleted = await pedidoRepositorie.delete({ id:id })
            // if (deleted.affected === 0) {
            // return res.status(404).json({ message: "Pedido não encontrado" })
            // }
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
