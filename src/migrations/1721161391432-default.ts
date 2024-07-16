import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1721161391432 implements MigrationInterface {
    name = 'Default1721161391432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "dataHora" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "dataHora"`);
    }

}
