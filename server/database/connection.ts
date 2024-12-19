import { Sequelize } from "sequelize";

const db = new Sequelize("usc_database", "root", "8Mo@OP1519wj", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default db;
