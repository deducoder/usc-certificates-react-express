import { DataTypes } from "sequelize";
import db from "../database/connection";
//importing other models
import Career from "./career";

const Subject = db.define(
  "Subject",
  {
    SUBJECT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    CAREER_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        //foreignkey references to careers table
        model: Career,
        key: "CAREER_ID  ",
      },
    },
    SUBJECT_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    SUBJECT_PERIOD: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 8,
        min: 1,
      },
    },
    SUBJECT_STATUS: {
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
      //uppercase before save or update
      beforeSave: (subject: any) => {
        if (subject.SUBJECT_NAME) {
          subject.SUBJECT_NAME = subject.SUBJECT_NAME.toUpperCase();
        }
      },
    },
    tableName: "SUBJECTS",
    createdAt: "SUBJECT_CREATION",
    updatedAt: "SUBJECT_LAST_UPDATE",
  }
);

Subject.belongsTo(Career, {
  foreignKey: "CAREER_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Career.hasMany(Subject, {
  foreignKey: "CAREER_ID",
});

export default Subject;
