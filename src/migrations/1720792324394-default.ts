import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720792324394 implements MigrationInterface {
    name = 'Default1720792324394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pedidos_formapagamento_enum" AS ENUM('cartao de credito', 'cartao de debito', 'dinheiro', 'pix')`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "FormaPagamento" "public"."pedidos_formapagamento_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "troco" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "troco"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "FormaPagamento"`);
        await queryRunner.query(`DROP TYPE "public"."pedidos_formapagamento_enum"`);
    }

}
