import { DataTypes } from "sequelize";
import db from "../database/connection";

const People = db.define(
  "People",
  {
    PEOPLE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    PEOPLE_PREFIX: {
      type: DataTypes.STRING,
    },
    PEOPLE_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PEOPLE_CHARGE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PEOPLE_GENDER: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        isIn: [[0, 1]],
      },
    },
  },
  {
    hooks: {
      beforeSave: (people: any) => {
        if (people.PEOPLE_PREFIX) {
          people.PEOPLE_PREFIX = people.PEOPLE_PREFIX.toUpperCase();
        }
        if (people.PEOPLE_NAME) {
          people.PEOPLE_NAME = people.PEOPLE_NAME.toUpperCase();
        }
        if (people.PEOPLE_CHARGE) {
          people.PEOPLE_CHARGE = people.PEOPLE_CHARGE.toUpperCase();
        }
      },
    },
    tableName: "PEOPLE",
    timestamps: false,
  }
);

export default People;
