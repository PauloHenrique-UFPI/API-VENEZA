import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720735070900 implements MigrationInterface {
    name = 'Default1720735070900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promocao" ALTER COLUMN "descricao" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."pedidos_status_enum" AS ENUM('pendente', 'cancelado', 'aceito', 'saiu para entrega', 'entregue', 'finalizado')`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "status" "public"."pedidos_status_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."pedidos_status_enum"`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "promocao" ALTER COLUMN "descricao" SET NOT NULL`);
    }

}
