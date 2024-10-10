import { DataTypes } from "sequelize";
import db from "../database/connection";
//importing other models
import Student from "./student";
import Subject from "./subjects";

const Score = db.define(
  "Score",
  {
    SCORE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    STUDENT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        //foreignkey referentes to students table
        model: Student,
        key: "STUDENT_ID",
      },
    },
    SUBJECT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        //foreignkey references to subjects table
        model: Subject,
        key: "SUBJECT_ID",
      },
    },
    SCORE: {
      //type: DataTypes.DECIMAL(3, 1),
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 10.0,
        min: 0.0,
      },
    },
    SCORE_OBSERVATION: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["EX", "TS", "EQ", "ex", "ts", "eq"]],
      },
    },
    SCORE_STATUS: {
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
      beforeSave: (score: any) => {
        if (score.SCORE_OBSERVATION) {
          score.SCORE_OBSERVATION = score.SCORE_OBSERVATION.toUpperCase();
        }
      },
    },
    tableName: "SCORES",
    createdAt: "SCORE_CREATION",
    updatedAt: "SCORE_LAST_UPDATE",
  }
);

//foreignkeys
Score.belongsTo(Student, {
  foreignKey: "STUDENT_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Score.belongsTo(Subject, {
  foreignKey: "SUBJECT_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Student.hasMany(Score, {
  foreignKey: "STUDENT_ID",
});

Subject.hasMany(Score, {
  foreignKey: "SUBJECT_ID",
});

export default Score;
