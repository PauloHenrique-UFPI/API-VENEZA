import { Router } from "express";
import { UsuarioController } from "./controllers/UsuarioControllers";
import authMiddleware from "./middlewares/authMiddleware";
import { PedidoController } from "./controllers/PedidoControllers";


const routes = Router();

//Rotas de Usuario
routes.post('/criar',new UsuarioController().create)
routes.post('/login', new UsuarioController().login)
routes.delete('/deletar-usuario/:id', authMiddleware, new UsuarioController().delete)

//Rotas de Pedido
routes.post('/criar-pedido', authMiddleware, new PedidoController().create)
routes.get('/todos-pedidos', authMiddleware, new PedidoController().pedidos)
routes.get('/unico-pedido/:id', authMiddleware, new PedidoController().pedidoId)
routes.put('/alterar-pedido/:id', authMiddleware, new PedidoController().alter)
routes.delete('/deletar-pedido/:id', authMiddleware, new PedidoController().delete)

export default routes

