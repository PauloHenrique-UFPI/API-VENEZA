import { Request, Response } from "express";
import { userRepositorie } from "../repositories/UsuarioRepositorie";
import * as bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const secret = process.env.SECRET as string 

export class UsuarioController {

    async create(req: Request, res: Response){
        //cria usuario

        const { email, telefone, dataNascimento, senha, cep, endereco, tipo } = req.body;

        if (!email || !telefone || !dataNascimento || !senha || !cep || !endereco || !tipo ){
            return res.status(400).json({ message: "Todos os campos são Obrigatorios !"})
        }

        const userFind = await userRepositorie.findOne( { where: {
            email: email,
        } } ); 

        if (userFind) {
            return res.status(403).json({
            message: "Email já cadastrado",
            });
        }

        try {
            
            const hashP = await bcrypt.hash(senha, 10);
            const newUser = userRepositorie.create({
                email: email, 
                telefone: telefone, 
                dataNascimento: dataNascimento, 
                senha: hashP, 
                cep: cep, 
                endereco: endereco,
                tipo: tipo
            })

            await userRepositorie.save(newUser);
            return res.json({
                message: "Usuário criado !",
              });
            

        } catch (error) {
            console.log(error);
            return res.status(500).json({
              message: "erro interno",
            });
          }
      
    }


    async login(req: Request, res: Response) {

        try {
            const { email, senha } = req.body;
            if (!email || !senha) {
              return res.status(433).json({
                message: "email e senha são campos obrigatórios",
              });
            }

            const userExist = await userRepositorie.findOne({ where: {
                email: email,
            } });

            if (!userExist || "") {
                return res.status(404).json({
                message: "usuario não encontrado",
                });
            }

            const authorization = await bcrypt.compare(
                senha,
                userExist.senha
              );

            if (authorization) {
                const date = Date();
        
                const token = jwt.sign(
                    {
                    ...userExist,
                    senha: undefined,
                    date: date,
                    },
                    secret,
                );
                return res.json({
                    message: "login efetuado",
                    ...userExist,
                    senha: undefined,
                    token,
                });
                } else {
                return res.status(403).json({
                    message: "senha inválida",
                });
                }


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
            const deleted = await userRepositorie.delete({ id:id })
            if (deleted.affected === 0) {
            return res.status(404).json({ message: "Usuario não encontrado" })
            }
            return res.json({ message: "Usuario deletado" })
        }
        catch (error) {
          console.log(error);
          return res.status(500).json({
            message: "erro interno",
          });
        }
      }
      
}