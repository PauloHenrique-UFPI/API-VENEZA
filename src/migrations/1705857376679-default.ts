import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1705857376679 implements MigrationInterface {
    name = 'Default1705857376679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "img" character varying`);
        await queryRunner.query(`ALTER TABLE "pedidos" ALTER COLUMN "preco" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" ALTER COLUMN "preco" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "img"`);
    }

}
