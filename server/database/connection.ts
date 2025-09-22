import { Sequelize } from "sequelize";

const db = new Sequelize("usc_database", "root", "#jc@kfYkp7Hc", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default db;
