import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1719429965342 implements MigrationInterface {
    name = 'Default1719429965342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "pizza" ADD "preco" json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "pizza" ADD "preco" double precision NOT NULL`);
    }

}
