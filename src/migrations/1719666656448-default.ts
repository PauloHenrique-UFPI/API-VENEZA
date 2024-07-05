import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1719666656448 implements MigrationInterface {
    name = 'Default1719666656448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido_pizza" DROP CONSTRAINT "FK_09577f35e7932b370600e52037f"`);
        await queryRunner.query(`CREATE TABLE "pedido_pizza_sabores_pizza" ("pedidoPizzaId" integer NOT NULL, "pizzaId" integer NOT NULL, CONSTRAINT "PK_b83c210bf31349ce2ee31cfc797" PRIMARY KEY ("pedidoPizzaId", "pizzaId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eecf12b025af169dcfd71a6d1c" ON "pedido_pizza_sabores_pizza" ("pedidoPizzaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ddda4b83719fb3e04031f69f0c" ON "pedido_pizza_sabores_pizza" ("pizzaId") `);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" DROP COLUMN "pizzaId"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza_sabores_pizza" ADD CONSTRAINT "FK_eecf12b025af169dcfd71a6d1ca" FOREIGN KEY ("pedidoPizzaId") REFERENCES "pedido_pizza"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza_sabores_pizza" ADD CONSTRAINT "FK_ddda4b83719fb3e04031f69f0c9" FOREIGN KEY ("pizzaId") REFERENCES "pizza"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedido_pizza_sabores_pizza" DROP CONSTRAINT "FK_ddda4b83719fb3e04031f69f0c9"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza_sabores_pizza" DROP CONSTRAINT "FK_eecf12b025af169dcfd71a6d1ca"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" ADD "pizzaId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ddda4b83719fb3e04031f69f0c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eecf12b025af169dcfd71a6d1c"`);
        await queryRunner.query(`DROP TABLE "pedido_pizza_sabores_pizza"`);
        await queryRunner.query(`ALTER TABLE "pedido_pizza" ADD CONSTRAINT "FK_09577f35e7932b370600e52037f" FOREIGN KEY ("pizzaId") REFERENCES "pizza"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
