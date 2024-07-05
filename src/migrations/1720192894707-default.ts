import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720192894707 implements MigrationInterface {
    name = 'Default1720192894707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "descricao" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "descricao"`);
    }

}
