import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1699892221780 implements MigrationInterface {
    name = 'Default1699892221780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "telefone" character varying NOT NULL, "dataNascimento" character varying NOT NULL, "senha" character varying NOT NULL, "cep" character varying NOT NULL, "endereco" character varying NOT NULL, CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" SERIAL NOT NULL, "codADM" character varying NOT NULL, "usuario_id" integer, CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pedidos" ("id" SERIAL NOT NULL, "tipo" character varying NOT NULL, "tamanho" character varying NOT NULL, "complemento" character varying NOT NULL, "preco" character varying NOT NULL, "troco" character varying NOT NULL, "endereco" character varying NOT NULL, "nomeCliente" character varying NOT NULL, "contato" character varying NOT NULL, CONSTRAINT "PK_ebb5680ed29a24efdc586846725" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cozinheiros" ("id" SERIAL NOT NULL, "codCozinheiro" character varying NOT NULL, "usuario_id" integer, CONSTRAINT "PK_11c00181a3d618f21bf66afd03b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "entregadores" ("id" SERIAL NOT NULL, "codEntregador" character varying NOT NULL, "usuario_id" integer, CONSTRAINT "PK_812545842bfa52f5dae0d9f7ac1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "atendentes" ("id" SERIAL NOT NULL, "codAtendente" character varying NOT NULL, "usuario_id" integer, CONSTRAINT "PK_b471a2fb0779220da74fe70888b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_e774f0b956c8156301f88bdda73" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cozinheiros" ADD CONSTRAINT "FK_085cac6f8eb00213a90f6fee590" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "entregadores" ADD CONSTRAINT "FK_f19097a9120540199d64d0190b0" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "atendentes" ADD CONSTRAINT "FK_7fa13ccd0a2f5cb80c49111ab78" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "atendentes" DROP CONSTRAINT "FK_7fa13ccd0a2f5cb80c49111ab78"`);
        await queryRunner.query(`ALTER TABLE "entregadores" DROP CONSTRAINT "FK_f19097a9120540199d64d0190b0"`);
        await queryRunner.query(`ALTER TABLE "cozinheiros" DROP CONSTRAINT "FK_085cac6f8eb00213a90f6fee590"`);
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_e774f0b956c8156301f88bdda73"`);
        await queryRunner.query(`DROP TABLE "atendentes"`);
        await queryRunner.query(`DROP TABLE "entregadores"`);
        await queryRunner.query(`DROP TABLE "cozinheiros"`);
        await queryRunner.query(`DROP TABLE "pedidos"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
