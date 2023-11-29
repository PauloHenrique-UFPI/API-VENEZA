import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1701045591003 implements MigrationInterface {
    name = 'Default1701045591003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "tipo" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "tipo"`);
    }

}
