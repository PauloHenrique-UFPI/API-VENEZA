import { Router } from "express";
import { UsuarioController } from "./controllers/UsuarioControllers";
import authMiddleware from "./middlewares/authMiddleware";
import { PedidoController } from "./controllers/PedidoControllers";
import { storage } from "firebase-admin";
import { PizzaController } from "./controllers/PizzaControllers";

import multer from 'multer';
import { BebidaController } from "./controllers/BebidaControllers";
import { BordaController, IngredienteAdicionalController } from "./controllers/BordaIngredienteControllers";
import { PromocaoController } from "./controllers/PromocaoControllers";
import { ImprimirControllers } from "./controllers/ImprimirController";
import { StatusPedidoController } from "./controllers/StatusPedidoController";
const uploadImage = require("./services/firebase");

const Multer = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024,
    },
}); 


const routes = Router();

//Rotas de Usuario
routes.post('/criar', new UsuarioController().create)
routes.post('/login', new UsuarioController().login)
routes.get('/todos', authMiddleware, new UsuarioController().contatos)
routes.get('/user/:id', authMiddleware, new UsuarioController().usuarioId)
routes.delete('/deletar-usuario/:id', authMiddleware, new UsuarioController().delete)
routes.post('/esqueci', new UsuarioController().enviarEmailRedefinicao)
routes.post('/trocarSenha', new UsuarioController().resetarSenha)
routes.put('/alterarDados-usuario/:id', authMiddleware, new UsuarioController().alterarUsuario)
routes.post('/usuarios-tipo', authMiddleware, new UsuarioController().usuariosTipo)
routes.get('/unico-usuario/:id', authMiddleware, new UsuarioController().usuarioId)

//Rotas de enderecos
routes.post('/adicionar-endereco/:id', authMiddleware, new UsuarioController().createEndereco)
routes.put('/alterar-endereco/', authMiddleware, new UsuarioController().updateEndereco)
routes.delete('/deletar-endereco/', authMiddleware, new UsuarioController().deleteEndereco)

//Rotas de Pedido
routes.post('/criar-pedido', authMiddleware, new PedidoController().create)
routes.get('/todos-pedidos', authMiddleware, new PedidoController().pedidos)
routes.get('/unico-pedido/:id', authMiddleware, new PedidoController().pedidoId)
routes.get('/usuario-pedido/:id', authMiddleware, new PedidoController().pedidosUsuarioId)
routes.put('/alterar-pedido/:id', authMiddleware, Multer.single('img'), uploadImage, new PedidoController().alter)
routes.delete('/deletar-pedido/:id', authMiddleware, new PedidoController().delete)
routes.get('/imprimir-pedido/:id', new ImprimirControllers().imprimirPedido)
routes.put('/addpizza-carrinho/:id', authMiddleware, new PedidoController().addPizzaCarrinho)
routes.put('/aprovar-carrinho/:id', authMiddleware, new PedidoController().aprovarCarrinho)

//Status do pedido
routes.put('/aceitar-pedido/:id', authMiddleware, new StatusPedidoController().aceitaPedido) // pedido aceito
routes.put('/entregar-pedido/:id', authMiddleware, new StatusPedidoController().entregaPedido) // pedido saiu para entrega
routes.put('/entregou-pedido/:id', authMiddleware, new StatusPedidoController().entregouPedido) // pedido entregue
routes.put('/finalizar-pedido/:id', authMiddleware, new StatusPedidoController().finalizaPedido) // pedido entregue e pago
routes.put('/cancelar-pedido/:id', authMiddleware, new StatusPedidoController().cancelaPedido) // pedido cancelado

//Rotas de Pizza
routes.post('/criar-pizza', authMiddleware, Multer.single('img'), uploadImage ,new PizzaController().create)
routes.get('/todas-pizza', new PizzaController().pizzas)
//routes.get('/pizza-promocao', new PizzaController().promocao)
routes.get('/unica-pizza/:id', authMiddleware, new PizzaController().pizzaID)
routes.put('/alterar-pizza/:id', authMiddleware,  Multer.single('img'), uploadImage, new PizzaController().alter)
routes.delete('/deletar-pizza/:id', authMiddleware, new PizzaController().delete)

//Rotas de borda e ingrediente adicional
routes.get('/unica-borda/:id', authMiddleware, new BordaController().getBorda)
routes.get('/todas-borda', authMiddleware, new BordaController().getAllBordas)
routes.post('/criar-borda', authMiddleware, new BordaController().createBorda)
routes.put('/alterar-borda/:id', authMiddleware, new BordaController().alterBorda)
routes.delete('/deletar-borda/:id', authMiddleware, new BordaController().deleteBorda)
routes.get('/unico-ingrediente/:id', authMiddleware, new IngredienteAdicionalController().getIngrediente)
routes.get('/todos-ingrediente', authMiddleware, new IngredienteAdicionalController().getAllIngredientes)
routes.post('/criar-ingrediente', authMiddleware, new IngredienteAdicionalController().createIngredienteAdicional)
routes.put('/alterar-ingrediente/:id', authMiddleware, new IngredienteAdicionalController().alterIngrediente)
routes.delete('/deletar-ingrediente/:id', authMiddleware, new IngredienteAdicionalController().deleteIngrediente)

//Rotas de promoção
routes.post('/cria-promocao', authMiddleware, new PromocaoController().createPromocao)
routes.get('/todas-promocao', authMiddleware, new PromocaoController().todasPromocao)
routes.get('/unica-promocao/:id', authMiddleware, new PromocaoController().unicaPromocao)
routes.put('/alterar-promocao/:id', authMiddleware, new PromocaoController().alterPromocao)
routes.delete('/delete-promocao/:id', authMiddleware, new PromocaoController().deletePromocao)

//Rotas de bebidas
routes.post('/criar-bebida', authMiddleware, Multer.single('img'), uploadImage ,new BebidaController().create)
routes.get('/todas-bebida', new BebidaController().bebidas)
routes.get('/unica-bebida/:id', authMiddleware, new BebidaController().bebidaID)
routes.put('/alterar-bebida/:id', authMiddleware,  Multer.single('img'), uploadImage, new BebidaController().alter)
routes.delete('/deletar-bebida/:id', authMiddleware, new BebidaController().delete)


export default routes
