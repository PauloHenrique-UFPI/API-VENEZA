import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1715726348353 implements MigrationInterface {
    name = 'Default1715726348353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "preco" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "troco"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "troco" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "troco"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "troco" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "preco" character varying`);
    }

}
