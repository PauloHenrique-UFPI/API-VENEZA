import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1721328550265 implements MigrationInterface {
    name = 'Default1721328550265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enderecos" ADD "bairoId" integer`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD "enderecoEntregaId" integer`);
        await queryRunner.query(`ALTER TABLE "enderecos" ADD CONSTRAINT "FK_095249d5762920b0cf6162ad8ed" FOREIGN KEY ("bairoId") REFERENCES "bairos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_10fd9f8ea102e0ebe5c98323378" FOREIGN KEY ("enderecoEntregaId") REFERENCES "enderecos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_10fd9f8ea102e0ebe5c98323378"`);
        await queryRunner.query(`ALTER TABLE "enderecos" DROP CONSTRAINT "FK_095249d5762920b0cf6162ad8ed"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP COLUMN "enderecoEntregaId"`);
        await queryRunner.query(`ALTER TABLE "enderecos" DROP COLUMN "bairoId"`);
    }

}
