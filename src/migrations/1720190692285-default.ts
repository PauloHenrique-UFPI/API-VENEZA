import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720190692285 implements MigrationInterface {
    name = 'Default1720190692285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pedidos_local_enum" AS ENUM('entrega', 'retirada', 'no local')`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "local" "public"."pedidos_local_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "local"`);
        await queryRunner.query(`DROP TYPE "public"."pedidos_local_enum"`);
    }

}
