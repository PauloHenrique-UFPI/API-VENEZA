import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1715716063524 implements MigrationInterface {
    name = 'Default1715716063524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bebida" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "bebida" ADD "preco" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bebida" DROP COLUMN "preco"`);
        await queryRunner.query(`ALTER TABLE "bebida" ADD "preco" integer NOT NULL`);
    }

}
