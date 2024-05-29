import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1716940744679 implements MigrationInterface {
    name = 'Default1716940744679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bebida" ADD "qtd" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "bebidas" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "bebidas"`);
        await queryRunner.query(`ALTER TABLE "bebida" DROP COLUMN "qtd"`);
    }

}
