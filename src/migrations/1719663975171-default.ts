import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1719663975171 implements MigrationInterface {
    name = 'Default1719663975171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "precoTotal" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "precoTotal"`);
    }

}
