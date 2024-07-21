import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1721307765298 implements MigrationInterface {
    name = 'Default1721307765298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bairos" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "taxaEntrega" integer NOT NULL, CONSTRAINT "PK_928af5a8aca5aeb1078dc7cdf24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "enderecos" ("id" SERIAL NOT NULL, "cep" character varying NOT NULL, "endereco" character varying NOT NULL, "referencia" character varying NOT NULL, "usuarioId" integer, CONSTRAINT "PK_208b05002dcdf7bfbad378dcac1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "cep"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "endereco"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "tipo"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "nome" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_usuariotipo_enum" AS ENUM('user', 'admin', 'atendente')`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "usuarioTipo" "public"."usuarios_usuariotipo_enum"`);
        await queryRunner.query(`ALTER TABLE "enderecos" ADD CONSTRAINT "FK_3fda1857bc40b2c12b9562101ac" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enderecos" DROP CONSTRAINT "FK_3fda1857bc40b2c12b9562101ac"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "usuarioTipo"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_usuariotipo_enum"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "nome"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "tipo" character varying`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "endereco" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "cep" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "enderecos"`);
        await queryRunner.query(`DROP TABLE "bairos"`);
    }

}
