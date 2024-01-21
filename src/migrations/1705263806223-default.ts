import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1705263806223 implements MigrationInterface {
    name = 'Default1705263806223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pizza" ("id" SERIAL NOT NULL, "img" character varying NOT NULL, "sabor" character varying NOT NULL, "ingredientes" character varying NOT NULL, "preco" integer NOT NULL, "promocao" boolean NOT NULL, CONSTRAINT "PK_cb1970bd1d17619fd6bc1ec7414" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pizza"`);
    }

}
