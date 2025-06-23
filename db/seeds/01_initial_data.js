/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").truncate();
  await knex("login").truncate();

  await knex("users").insert([
    {
      id: 1,
      name: "ok",
      email: "okok@gmail.com",
      entries: 2,
      joined: new Date(),
    },
  ]);

  await knex("login").insert([
    {
      // It's good practice to ensure this ID matches the user's ID
      id: 1,
      hash: "$2b$14$1Ma0PKA0QprZ5e/cR4/Lyu2xwB25T3IOxOVaG7aICzk1s2UYaKOTu",
      email: "ok@gmail.com",
    },
  ]);
};
