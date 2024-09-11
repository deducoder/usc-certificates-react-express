import { DataTypes } from "sequelize";
import db from "../database/connection";

const User = db.define(
  "User",
  {
    USER_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    USER_EMAIL: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    USER_PASSWORD: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    USER_ROLE: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["admin", "superAdmin"]],
      },
    },
    USER_STATUS: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
      validate: {
        isIn: [[0, 1]],
      },
    },
  },
  {
    tableName: "USERS",
    createdAt: "USER_CREATION",
    updatedAt: "USER_LAST_UPDATE",
  }
);

export default User;
