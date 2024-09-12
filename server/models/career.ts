import { DataTypes } from "sequelize";
import db from "../database/connection";
//importing other models

const Career = db.define(
  "Career",
  {
    CAREER_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    CAREER_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    CAREER_STATUS: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
      validate: {
        isIn: [[0, 1]],
      },
    },
  },
  {
    hooks: {
      //uppercae before save or update
      beforeSave: (career: any) => {
        if (career.CAREER_NAME) {
          career.CAREER_NAME = career.CAREER_NAME.toUpperCase();
        }
      },
    },
    tableName: "CAREERS",
    createdAt: "CAREER_CREATION",
    updatedAt: "CAREER_LAST_UPDATE",
  }
);

//foreignkeys

export default Career;
