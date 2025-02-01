import constants from "../constants/index.js";
const { tradeType } = constants

export function up(knex) {
  return knex.schema
    .createTable('security', function (table) {
      table.increments('id').primary(); // Auto-incrementing integer primary key
      table.string('ticker_symbol').unique().notNullable();
      table.string('name').notNullable();
      table.timestamps(true, true);
    })
    
    .createTable('portfolio', function (table) {
      table.increments('id').primary(); // Auto-incrementing integer primary key
      table.integer('security_id').unsigned().notNullable(); // Ensure unsigned integer
      table.decimal('average_buy_price', 10, 2).notNullable();
      table.integer('shares').notNullable().defaultTo(0);
      table.timestamps(true, true);
      
      // Foreign key constraints
      table.foreign('security_id').references('id').inTable('security').onDelete('CASCADE');
    })
    
    .createTable('trade', function (table) {
      table.increments('id').primary();
      table.integer('security_id').unsigned().notNullable();
      table.enum('trade_type', [tradeType.buy, tradeType.sell]).notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.integer('shares').notNullable();
      table.timestamps(true, true);

      // Foreign key constraints
      table.foreign('security_id').references('id').inTable('security').onDelete('CASCADE');
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('trade')
    .dropTableIfExists('portfolio')
    .dropTableIfExists('security');
}
