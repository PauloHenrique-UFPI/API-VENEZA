import { Router } from "express";
import { UsuarioController } from "./controllers/UsuarioControllers";
import authMiddleware from "./middlewares/authMiddleware";
import { PedidoController } from "./controllers/PedidoControllers";


const routes = Router();

//Rotas de Usuario
routes.post('/criar', new UsuarioController().create)
routes.post('/login', new UsuarioController().login)
routes.get('/todos', authMiddleware, new UsuarioController().contatos)
routes.delete('/deletar-usuario/:id', authMiddleware, new UsuarioController().delete)

//Rotas de Pedido
routes.post('/criar-pedido', authMiddleware, new PedidoController().create)
routes.get('/todos-pedidos', authMiddleware, new PedidoController().pedidos)
routes.get('/unico-pedido/:id', authMiddleware, new PedidoController().pedidoId)
routes.put('/alterar-pedido/:id', authMiddleware, new PedidoController().alter)
routes.delete('/deletar-pedido/:id', authMiddleware, new PedidoController().delete)

//Rotas de Pizza
routes.post('/criar-pizza', authMiddleware, new PedidoController().create)
routes.get('/todos-pizza', authMiddleware, new PedidoController().pedidos)
routes.get('/pizza-promocao', authMiddleware, new PedidoController().pedidos)
routes.get('/unico-pizza/:id', authMiddleware, new PedidoController().pedidoId)
routes.put('/alterar-pizza/:id', authMiddleware, new PedidoController().alter)
routes.delete('/deletar-pizza/:id', authMiddleware, new PedidoController().delete)


export default routes

