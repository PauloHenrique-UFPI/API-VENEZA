import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1715715929932 implements MigrationInterface {
    name = 'Default1715715929932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "pizza" ADD "preco" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "pizza" ADD "preco" integer NOT NULL`);
    }

}
