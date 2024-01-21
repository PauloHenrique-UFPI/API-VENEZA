import { Request, Response } from "express";
import { userRepositorie } from "../repositories/UsuarioRepositorie";
import * as bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import 'dotenv/config'


const secret = process.env.SECRET as string 

const EMAIL_USER = process.env.EMAIL_USER as string; 
const EMAIL_PASS = process.env.EMAIL_PASS as string;

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

    async contatos(req: Request, res: Response){
      try{
          const contatos = await userRepositorie.find();
          res.json({
           
            groups: contatos.map((contato) => {
              return {
                ...contato,
                senha: undefined,
                valid_sign: undefined,
                created_at: undefined
              }
            }),
          })
      } catch(error) {
          console.log(error);
          return res.status(500).json({message: "Erro no servidor"})
          
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

      async enviarEmailRedefinicao(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    message: "O campo 'email' é obrigatório",
                });
            }
  
            const usuario = await userRepositorie.findOne({ where: { email } });
  
            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado",
                });
            }
  
            const token = jwt.sign({ userId: usuario.id }, secret, { expiresIn: '1h' });
  
            const transporter = nodemailer.createTransport({
              service: 'gmail',
                auth: {
                  user: EMAIL_USER,
                  pass: EMAIL_PASS,
                },
              });
            
            const info = await transporter.sendMail({
              from: '"Pizzaria Veneza" <veneza@gmail.com>',
              to: email, // list of receivers
              subject: 'Redefinição de Senha',
              text: `Clique no link a seguir para redefinir sua senha: localhost/#/novaSenha/${token}`,
              }, (error, info) => {
                if(error){
                  console.log(error)
                  return res.status(500).json({ message: "Erro ao enviar e-mail" });
                }else{
                  return res.status(200).json({ message: "Email Enviado" });
                }
              
              } );
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Erro interno',
            });
        }
    }
  
    async resetarSenha(req: Request, res: Response) {
      try {
          const { token, novaSenha } = req.body;
  
          if (!token || !novaSenha) {
              return res.status(400).json({
                  message: "Os campos 'token' e 'novaSenha' são obrigatórios",
              });
          }
  
          const decodedToken: any = jwt.verify(token, secret);
  
          if (!decodedToken || !decodedToken.userId) {
              return res.status(400).json({
                  message: "Token inválido",
              });
          }
  
          const usuario = await userRepositorie.findOne({ where: { id: decodedToken.userId } });
  
          if (!usuario) {
              return res.status(404).json({
                  message: "Usuário não encontrado",
              });
          }
  
          const hashNovaSenha = await bcrypt.hash(novaSenha, 10);
          usuario.senha = hashNovaSenha;
          await userRepositorie.save(usuario);
  
          return res.json({
              message: "Senha redefinida com sucesso",
          });
      } catch (error) {
          console.log(error);
          return res.status(500).json({
              message: 'Erro interno',
          });
      }
    }
      
}