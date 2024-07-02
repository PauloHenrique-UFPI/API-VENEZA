import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1719515779334 implements MigrationInterface {
    name = 'Default1719515779334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza" DROP COLUMN "promocao"`);
        await queryRunner.query(`ALTER TABLE "pizza" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "pizza" ADD "precos" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza" DROP COLUMN "precos"`);
        await queryRunner.query(`ALTER TABLE "pizza" ADD "preco" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pizza" ADD "promocao" boolean NOT NULL`);
    }

}
