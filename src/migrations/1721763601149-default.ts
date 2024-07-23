import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1721763601149 implements MigrationInterface {
    name = 'Default1721763601149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."pedidos_status_enum" RENAME TO "pedidos_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pedidos_status_enum" AS ENUM('carrinho', 'pendente', 'cancelado', 'aceito', 'saiu para entrega', 'entregue', 'finalizado')`);
        await queryRunner.query(`ALTER TABLE "pedidos" ALTER COLUMN "status" TYPE "public"."pedidos_status_enum" USING "status"::"text"::"public"."pedidos_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pedidos_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pedidos_status_enum_old" AS ENUM('pendente', 'cancelado', 'aceito', 'saiu para entrega', 'entregue', 'finalizado')`);
        await queryRunner.query(`ALTER TABLE "pedidos" ALTER COLUMN "status" TYPE "public"."pedidos_status_enum_old" USING "status"::"text"::"public"."pedidos_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."pedidos_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pedidos_status_enum_old" RENAME TO "pedidos_status_enum"`);
    }

}
