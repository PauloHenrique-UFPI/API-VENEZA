import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1705857065388 implements MigrationInterface {
    name = 'Default1705857065388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "qtd" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "qtd"`);
    }

}
