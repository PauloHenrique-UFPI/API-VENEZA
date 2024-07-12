import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720793030582 implements MigrationInterface {
    name = 'Default1720793030582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" RENAME COLUMN "FormaPagamento" TO "formaPapagamento"`);
        await queryRunner.query(`ALTER TYPE "public"."pedidos_formapagamento_enum" RENAME TO "pedidos_formapapagamento_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pedidos_formapapagamento_enum" RENAME TO "pedidos_formapagamento_enum"`);
        await queryRunner.query(`ALTER TABLE "pedidos" RENAME COLUMN "formaPapagamento" TO "FormaPagamento"`);
    }

}
