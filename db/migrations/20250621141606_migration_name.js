/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("id").primary();
      table.string("name", 100).notNullable();
      table.text("email").notNullable().unique();
      table.bigInteger("entries").defaultTo(0);
      table.timestamp("joined").notNullable();
    })
    .createTable("login", function (table) {
      table.increments("id").primary();
      table.string("hash", 100).notNullable();
      table.text("email").notNullable().unique();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users").dropTable("login");
};
