import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1716908163107 implements MigrationInterface {
    name = 'Default1716908163107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "tipo"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "complemento"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "img"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "pizzas" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "pizzas"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "img" character varying`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "complemento" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "tipo" character varying NOT NULL`);
    }

}
