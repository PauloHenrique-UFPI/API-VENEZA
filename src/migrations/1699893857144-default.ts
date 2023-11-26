import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1699893857144 implements MigrationInterface {
    name = 'Default1699893857144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "dataNascimento"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "dataNascimento" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "dataNascimento"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "dataNascimento" character varying NOT NULL`);
    }

}
