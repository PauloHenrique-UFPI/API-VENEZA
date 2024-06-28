import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1719518356379 implements MigrationInterface {
    name = 'Default1719518356379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promocao" ("id" SERIAL NOT NULL, "tamanho" character varying NOT NULL, "precoPromocional" numeric NOT NULL, "descricao" character varying NOT NULL, "pizzaId" integer, CONSTRAINT "PK_3d23ec4f70f4b80e5f05c7e3132" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "promocao" ADD CONSTRAINT "FK_440fc599d20804b92ce2ec80259" FOREIGN KEY ("pizzaId") REFERENCES "pizza"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promocao" DROP CONSTRAINT "FK_440fc599d20804b92ce2ec80259"`);
        await queryRunner.query(`DROP TABLE "promocao"`);
    }

}
