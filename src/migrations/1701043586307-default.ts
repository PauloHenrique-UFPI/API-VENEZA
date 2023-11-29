import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1701043586307 implements MigrationInterface {
    name = 'Default1701043586307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "status"`);
    }

}
