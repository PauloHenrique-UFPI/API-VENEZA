import { Request, Response } from "express";
import { userRepositorie } from "../repositories/UsuarioRepositorie";
import * as bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import 'dotenv/config'
import { UsuariosTipo } from "../enums/usuariosTipo";
import { enderecoUsuarioRepositorie } from "../repositories/UsuarioTipoRepositorie";


const secret = process.env.SECRET as string 

const EMAIL_USER = process.env.EMAIL_USER as string; 
const EMAIL_PASS = process.env.EMAIL_PASS as string;

export class UsuarioController {

  async create(req: Request, res: Response){
    //cria usuario

    const { nome, email, telefone, dataNascimento, senha, tipo, cep, endereco, referencia } = req.body;
    // const { email, telefone, dataNascimento, senha, cep, endereco, tipo } = req.body;

    if (!nome || !email || !telefone || !dataNascimento || !senha || !cep || !endereco || !tipo ){
      return res.status(400).json({ message: "Todos os campos são Obrigatorios !"})
    }

    const userFind = await userRepositorie.findOne( { where: {email: email} } ); 

    if (!Object.values(UsuariosTipo).includes(tipo)){
      return res.status(400).json({ message: "Tipo de usuário inválido"})
    }

    if (userFind) {
        return res.status(403).json({
        message: "Email já cadastrado",
        });
    }
    

    try {
      
      const hashP = await bcrypt.hash(senha, 10);
      const newUser = userRepositorie.create({
        nome: nome,
        email: email, 
        telefone: telefone, 
        dataNascimento: dataNascimento, 
        senha: hashP,
        usuarioTipo: tipo
      })
      const usuarioAtual = await userRepositorie.save(newUser);
      
      const endereAtual = await enderecoUsuarioRepositorie.create({
        cep: cep,
        endereco: endereco,
        referencia: referencia,
        usuario: usuarioAtual
      })
      await enderecoUsuarioRepositorie.save(endereAtual)
      // await userRepositorie.save(newUser);
      return res.status(201).json({ message: "Usuário criado !"});
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "erro interno",
      });
    }
    
  }

  async alterarUsuario(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const { nome, email, telefone, dataNascimento, tipo } = req.body;

    const userFind = await userRepositorie.findOne( { where: {email: email} } ); 
    if (userFind) {
      return res.status(403).json({ message: "Email já cadastrado"});
    }
    if (!Object.values(UsuariosTipo).includes(tipo)){
      return res.status(400).json({ message: "Tipo de usuário inválido"})
    }
    try {
        const usuario = await userRepositorie.findOne({ where: { id } });
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        // Atualiza os campos do usuário, exceto a senha
        if (nome) usuario.nome = nome;
        if (email) usuario.email = email;
        if (telefone) usuario.telefone = telefone;
        if (dataNascimento) usuario.dataNascimento = new Date(dataNascimento);
        if (tipo) usuario.usuarioTipo = tipo;

        await userRepositorie.save(usuario);

        return res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno" });
    }
}

  async createEndereco(req: Request, res: Response) {
    const { cep, endereco, referencia } = req.body;
    const id = parseInt(req.params.id, 10);

    try {
      const usuarioAtual = await userRepositorie.findOne({ where: { id: id }, relations: ["enderecos"] });

      if (!usuarioAtual) {
          return res.status(400).json({ message: "Usuário não encontrado!" });
      }

      if (!cep || !endereco || !referencia) {
          return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
      }

      const novoEndereco = enderecoUsuarioRepositorie.create({
          cep: cep,
          endereco: endereco,
          referencia: referencia,
          usuario: usuarioAtual
      });

      await enderecoUsuarioRepositorie.save(novoEndereco);

      return res.status(201).json({ message: "Novo endereço adicionado!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
          message: "Erro interno",
      });
    }
  }
  async updateEndereco(req: Request, res: Response) {
    // const { usuarioId, enderecoId } = req.params;
    const { usuarioId, enderecoId, cep, endereco, referencia } = req.body;

    try {
        const usuario = await userRepositorie.findOne({ where: { id: parseInt(usuarioId, 10) }, relations: ["enderecos"] });
        if (!usuario) {
          return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        const enderecoParaAtualizar = await enderecoUsuarioRepositorie.findOne({ where: { id: parseInt(enderecoId, 10), usuario: usuario } });
        if (!enderecoParaAtualizar) {
          return res.status(404).json({ message: "Endereço não encontrado!" });
        }

        if (!cep || !endereco || !referencia) {
          return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
        }

        enderecoParaAtualizar.cep = cep;
        enderecoParaAtualizar.endereco = endereco;
        enderecoParaAtualizar.referencia = referencia;

        await enderecoUsuarioRepositorie.save(enderecoParaAtualizar);

        return res.status(200).json({ message: "Endereço atualizado com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno" });
    }
  }

  async deleteEndereco(req: Request, res: Response) {
    const { usuarioId, enderecoId } = req.body;

    try {
        const usuario = await userRepositorie.findOne({ where: { id: parseInt(usuarioId, 10) }, relations: ["enderecos"] });
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" });
        }

        const enderecoParaDeletar = await enderecoUsuarioRepositorie.findOne({ where: { id: parseInt(enderecoId, 10), usuario: usuario } });
        if (!enderecoParaDeletar) {
            return res.status(404).json({ message: "Endereço não encontrado!" });
        }

        await enderecoUsuarioRepositorie.remove(enderecoParaDeletar);

        return res.status(200).json({ message: "Endereço deletado com sucesso!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno" });
    }
  }

  

    async contatos(req: Request, res: Response){
      try{
          const contatos = await userRepositorie.find({relations: ["enderecos"] });
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
            await enderecoUsuarioRepositorie.delete({usuario: {id:id}})
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