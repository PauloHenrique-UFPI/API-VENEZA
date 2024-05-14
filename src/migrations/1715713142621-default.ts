import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1715713142621 implements MigrationInterface {
    name = 'Default1715713142621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bebida" ("id" SERIAL NOT NULL, "img" character varying NOT NULL, "nome" character varying NOT NULL, "litros" character varying NOT NULL, "preco" integer NOT NULL, "promocao" boolean NOT NULL, CONSTRAINT "PK_5566b3bc2306c737f59e775bfd8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "tipo" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ALTER COLUMN "tipo" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "bebida"`);
    }

}
