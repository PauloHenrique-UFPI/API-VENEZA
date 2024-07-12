export enum StatusPedido {
    PENDENTE = 'pendente',
    CANCELADO = 'cancelado',
    ACEITO = 'aceito',
    ENTREGAR = 'saiu para entrega',
    ENTREGUE = 'entregue', // quando foi entregue mas o pagamento não foi efetudo
    FINALIZADO = 'finalizado' // entregue e pagamento efetuado
}