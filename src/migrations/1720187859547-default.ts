import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720187859547 implements MigrationInterface {
    name = 'Default1720187859547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pedido_pizza_tamanho_enum" AS ENUM('P', 'M', 'G', 'GG')`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" ADD "tamanho" "public"."pedido_pizza_tamanho_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido_pizza" DROP COLUMN "tamanho"`);
        await queryRunner.query(`DROP TYPE "public"."pedido_pizza_tamanho_enum"`);
    }

}
