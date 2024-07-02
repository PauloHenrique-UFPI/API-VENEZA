import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1719580382560 implements MigrationInterface {
    name = 'Default1719580382560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pizza_categoria_enum" AS ENUM('tradicional', 'especial', 'premium')`);
        await queryRunner.query(`ALTER TABLE "pizza" ADD "categoria" "public"."pizza_categoria_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "promocao" DROP COLUMN "tamanho"`);
        await queryRunner.query(`CREATE TYPE "public"."promocao_tamanho_enum" AS ENUM('P', 'M', 'G', 'GG')`);
        await queryRunner.query(`ALTER TABLE "promocao" ADD "tamanho" "public"."promocao_tamanho_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promocao" DROP COLUMN "tamanho"`);
        await queryRunner.query(`DROP TYPE "public"."promocao_tamanho_enum"`);
        await queryRunner.query(`ALTER TABLE "promocao" ADD "tamanho" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pizza" DROP COLUMN "categoria"`);
        await queryRunner.query(`DROP TYPE "public"."pizza_categoria_enum"`);
    }

}
