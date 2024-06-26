import { Router } from "express";
import { UsuarioController } from "./controllers/UsuarioControllers";
import authMiddleware from "./middlewares/authMiddleware";
import { PedidoController } from "./controllers/PedidoControllers";
import { storage } from "firebase-admin";
import { PizzaController } from "./controllers/PizzaControllers";

import multer from 'multer';
import { BebidaController } from "./controllers/BebidaControllers";
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
routes.delete('/deletar-usuario/:id', authMiddleware, new UsuarioController().delete)
routes.post('/esqueci', new UsuarioController().enviarEmailRedefinicao)
routes.post('/trocarSenha', new UsuarioController().resetarSenha)

//Rotas de Pedido
routes.post('/criar-pedido', authMiddleware, new PedidoController().create)
routes.get('/todos-pedidos', authMiddleware, new PedidoController().pedidos)
routes.get('/unico-pedido/:id', authMiddleware, new PedidoController().pedidoId)
routes.put('/alterar-pedido/:id', authMiddleware, Multer.single('img'), uploadImage, new PedidoController().alter)
routes.delete('/deletar-pedido/:id', authMiddleware, new PedidoController().delete)

//Rotas de Pizza
routes.post('/criar-pizza', authMiddleware, Multer.single('img'), uploadImage ,new PizzaController().create)
routes.get('/todas-pizza', new PizzaController().pizzas)
//routes.get('/pizza-promocao', new PizzaController().promocao)
routes.get('/unica-pizza/:id', authMiddleware, new PizzaController().pizzaID)
routes.put('/alterar-pizza/:id', authMiddleware,  Multer.single('img'), uploadImage, new PizzaController().alter)
routes.delete('/deletar-pizza/:id', authMiddleware, new PizzaController().delete)

//Rotas de promoção
routes.post('/cria-promocao/', authMiddleware, new PizzaController().addPromocao)

//Rotas de bebidas
routes.post('/criar-bebida', authMiddleware, Multer.single('img'), uploadImage ,new BebidaController().create)
routes.get('/todas-bebida', new BebidaController().bebidas)
routes.get('/unica-bebida/:id', authMiddleware, new BebidaController().bebidaID)
routes.put('/alterar-bebida/:id', authMiddleware,  Multer.single('img'), uploadImage, new BebidaController().alter)
routes.delete('/deletar-bebida/:id', authMiddleware, new BebidaController().delete)


export default routes

