import { Request, Response } from "express";
import { pedidoRepositorie } from "../repositories/PedidoRepositorie";
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PedidoPizza } from "../entities/PedidoPizza";
import { Bebida } from "../entities/Bebida";
import * as fs from 'fs';
import * as path from 'path';

// Caminhos para os arquivos de fontes
const fontDescriptors = {
    Roboto: {
        normal: path.resolve(__dirname, '../fonts/Roboto-Regular.ttf'),
        bold: path.resolve(__dirname, '../fonts/Roboto-Medium.ttf'),
        italics: path.resolve(__dirname, '../fonts/Roboto-Italic.ttf'),
        bolditalics: path.resolve(__dirname, '../fonts/Roboto-MediumItalic.ttf')
    }
};

export class ImprimirControllers {
    async imprimirPedido(req: Request, res: Response) {
        const pedidoId = parseInt(req.params.id, 10);

        try {
            const pedido = await pedidoRepositorie.findOne({
                where: { id: pedidoId },
                relations: [
                    "pizzas",
                    "pizzas.sabores",
                    "pizzas.borda",
                    "pizzas.ingredientesAdicionais",
                    "bebidas",
                    "usuario"
                ]
            });

            if (!pedido) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }
            const now = new Date();
            const formattedDate = now.toLocaleDateString();
            const formattedTime = now.toLocaleTimeString();
            let taxa;
            if (pedido.enderecoEntrega.bairo != undefined){
                taxa = pedido.enderecoEntrega.bairo.taxaEntrega;
            }else{
                taxa = 0;
            }

            const docDefinition: TDocumentDefinitions = {
                content: [
                    { text: 'Veneza Pizza Express', style: 'hyper' },
                    { text: ` ${pedido.local.toUpperCase()}`, style: 'subheader' },
                    { text: `- Data: ${pedido.dataHora.toLocaleDateString()}`, style: 'subheader' },
                    { text: `- Hora: ${pedido.dataHora.toLocaleTimeString()}`, style: 'subheader' },
                    { text: `Pedido ID: ${pedido.id}`, style: 'subheader' },
                    { text: 'Itens:', style: 'header' },
                    { text: 'Pizzas:', style: 'subheader' },
                    {
                      ul: pedido.pizzas.map((pedidoPizza: PedidoPizza) => ({
                        text: `${pedidoPizza.sabores.map(sabores => sabores.sabor).join(', ')} - Tamanho: ${pedidoPizza.tamanho} - Preço: R$${pedidoPizza.precoTotal.toFixed(2)}`
                      }))
                    },
                    { text: 'Bebidas:', style: 'subheader' },
                    {
                      ul: pedido.bebidas.map((pedidoBebida: Bebida) => ({
                          text: `${pedidoBebida.nome} - Preço: R$${pedidoBebida.preco.toFixed(2)}`
                      }))
                    },
                    { text: 'Cliente:', style: 'header' },
                    { text: `- Cliente: ${pedido.usuario.email}`, style: 'subheader' },
                    { text: `- Cliente: ${pedido.usuario.telefone}`, style: 'subheader' },
                    { text: `- Endereço:`, style: 'subheader' },
                    { text: `-  Cep: ${pedido.enderecoEntrega.cep}`, style: 'subheader' },
                    { text: `-  Endereco: ${pedido.enderecoEntrega.endereco}`, style: 'subheader' },
                    { text: `-  Bairro: ${pedido.enderecoEntrega.bairo}`, style: 'subheader' },
                    { text: `-  Ponto de referência: ${pedido.enderecoEntrega.referencia}`, style: 'subheader' },
                    { text: `Observação: ${pedido.descricao}`, style: 'subheader' },
                    { text: `Pagamento`, style: 'header' },
                    { text: `Forma de pagamento:`},
                    { text: `- ${pedido.FormaPagamento}`},
                    { text: `- Troco: R$${pedido.troco.toFixed(2)}`},
                    // { text: `Subtotal de pizza (as): R$${pedido.pizzas.  toFixed(2)}`, style: 'subheader' },
                    // { text: `Subtotal de bebida (as): R$${pedido.precoTotal.toFixed(2)}`, style: 'subheader' },
                    { text: `- Taxa de entrega: ${taxa}`, style: 'subheader' },
                    { text: `- Preço total: R$${pedido.precoTotal.toFixed(2)}`, style: 'subheader' }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                    },
                    hyper: {
                      fontSize: 20,
                      bold: true,
                      alignment: 'center'
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true
                    }
                }
            };

            const printer = new PdfPrinter(fontDescriptors);

            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            const chunks: any[] = [];
            pdfDoc.on('data', chunk => {
                chunks.push(chunk);
            });

            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=pedido.pdf');
                res.send(result);
            });

            pdfDoc.end();

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno' });
        }
    }
}
