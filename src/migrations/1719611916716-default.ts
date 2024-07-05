import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1719611916716 implements MigrationInterface {
    name = 'Default1719611916716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "borda" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "preco" double precision NOT NULL, CONSTRAINT "PK_43fa471833536afb3745b35cad6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingrediente_adicional" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "preco" double precision NOT NULL, CONSTRAINT "PK_29d0a5810097b738ab9bd7ee5cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedido_pizza" ("id" SERIAL NOT NULL, "precoTotal" double precision NOT NULL, "pedidoId" integer, "pizzaId" integer, "bordaId" integer, CONSTRAINT "PK_19ca1a736acb4900b33ee41c17b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedido_pizza_ingredientes_adicionais_ingrediente_adicional" ("pedidoPizzaId" integer NOT NULL, "ingredienteAdicionalId" integer NOT NULL, CONSTRAINT "PK_52aa6c4b872e9f5ebea1a7b451b" PRIMARY KEY ("pedidoPizzaId", "ingredienteAdicionalId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9bd22b66bb73803cc0fd8c30d4" ON "pedido_pizza_ingredientes_adicionais_ingrediente_adicional" ("pedidoPizzaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d0c5efdce89af309bd493c07d5" ON "pedido_pizza_ingredientes_adicionais_ingrediente_adicional" ("ingredienteAdicionalId") `);
        await queryRunner.query(`CREATE TABLE "pedidos_bebidas_bebida" ("pedidosId" integer NOT NULL, "bebidaId" integer NOT NULL, CONSTRAINT "PK_d2608c931ed0b01c18a5929c8f6" PRIMARY KEY ("pedidosId", "bebidaId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe0a26686433b2683277219255" ON "pedidos_bebidas_bebida" ("pedidosId") `);
        await queryRunner.query(`CREATE INDEX "IDX_864a0fbad5ec48b65c5095f013" ON "pedidos_bebidas_bebida" ("bebidaId") `);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "tamanho"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "endereco"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "nomeCliente"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "contato"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "qtd"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "troco"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "pizzas"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "bebidas"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "usuarioId" integer`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" ADD CONSTRAINT "FK_fc921384a79c677512c2a123251" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" ADD CONSTRAINT "FK_09577f35e7932b370600e52037f" FOREIGN KEY ("pizzaId") REFERENCES "pizza"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" ADD CONSTRAINT "FK_4e97b3f35ecc261b8a8d03422e8" FOREIGN KEY ("bordaId") REFERENCES "borda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_e60a655127c227b5e063e73165b" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza_ingredientes_adicionais_ingrediente_adicional" ADD CONSTRAINT "FK_9bd22b66bb73803cc0fd8c30d45" FOREIGN KEY ("pedidoPizzaId") REFERENCES "pedido_pizza"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza_ingredientes_adicionais_ingrediente_adicional" ADD CONSTRAINT "FK_d0c5efdce89af309bd493c07d58" FOREIGN KEY ("ingredienteAdicionalId") REFERENCES "ingrediente_adicional"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pedidos_bebidas_bebida" ADD CONSTRAINT "FK_fe0a26686433b2683277219255c" FOREIGN KEY ("pedidosId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pedidos_bebidas_bebida" ADD CONSTRAINT "FK_864a0fbad5ec48b65c5095f0134" FOREIGN KEY ("bebidaId") REFERENCES "bebida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos_bebidas_bebida" DROP CONSTRAINT "FK_864a0fbad5ec48b65c5095f0134"`);
        await queryRunner.query(`ALTER TABLE "pedidos_bebidas_bebida" DROP CONSTRAINT "FK_fe0a26686433b2683277219255c"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza_ingredientes_adicionais_ingrediente_adicional" DROP CONSTRAINT "FK_d0c5efdce89af309bd493c07d58"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza_ingredientes_adicionais_ingrediente_adicional" DROP CONSTRAINT "FK_9bd22b66bb73803cc0fd8c30d45"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_e60a655127c227b5e063e73165b"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" DROP CONSTRAINT "FK_4e97b3f35ecc261b8a8d03422e8"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" DROP CONSTRAINT "FK_09577f35e7932b370600e52037f"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" DROP CONSTRAINT "FK_fc921384a79c677512c2a123251"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "usuarioId"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "bebidas" json`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "pizzas" json`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "troco" double precision`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "preco" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "qtd" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "contato" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "nomeCliente" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "endereco" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "tamanho" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_864a0fbad5ec48b65c5095f013"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0a26686433b2683277219255"`);
        await queryRunner.query(`DROP TABLE "pedidos_bebidas_bebida"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0c5efdce89af309bd493c07d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bd22b66bb73803cc0fd8c30d4"`);
        await queryRunner.query(`DROP TABLE "pedido_pizza_ingredientes_adicionais_ingrediente_adicional"`);
        await queryRunner.query(`DROP TABLE "pedido_pizza"`);
        await queryRunner.query(`DROP TABLE "ingrediente_adicional"`);
        await queryRunner.query(`DROP TABLE "borda"`);
    }

}
