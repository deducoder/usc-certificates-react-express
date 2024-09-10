import { Sequelize } from "sequelize";

const db = new Sequelize("usc_database_test", "root", "22JUCt2gQ9", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default db;
