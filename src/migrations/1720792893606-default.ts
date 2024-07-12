import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720792893606 implements MigrationInterface {
    name = 'Default1720792893606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" RENAME COLUMN "FormaPagamento" TO "formaPagamento"`);
        await queryRunner.query(`ALTER TYPE "public"."pedidos_formapagamento_enum" RENAME TO "pedidos_formapagamento_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pedidos_formapagamento_enum" RENAME TO "pedidos_formapagamento_enum"`);
        await queryRunner.query(`ALTER TABLE "pedidos" RENAME COLUMN "formaPagamento" TO "FormaPagamento"`);
    }

}
