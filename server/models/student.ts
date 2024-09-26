import { DataTypes } from "sequelize";
import db from "../database/connection";
//importing other models

const Student = db.define(
  "Student",
  {
    STUDENT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    STUDENT_TUITION: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    STUDENT_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    STUDENT_PA_LAST_NAME: {
      type: DataTypes.STRING,
    },
    STUDENT_MA_LAST_NAME: {
      type: DataTypes.STRING,
    },
    STUDENT_STATUS: {
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
      beforeSave: (student: any) => {
        if (student.STUDENT_NAME) {
          student.STUDENT_NAME = student.STUDENT_NAME.toUpperCase();
        }
        if (student.STUDENT_PA_LAST_NAME) {
          student.STUDENT_PA_LAST_NAME =
            student.STUDENT_PA_LAST_NAME.toUpperCase();
        }
        if (student.STUDENT_MA_LAST_NAME) {
          student.STUDENT_MA_LAST_NAME =
            student.STUDENT_MA_LAST_NAME.toUpperCase();
        }
      },
    },
    tableName: "STUDENTS",
    createdAt: "STUDENT_CREATION",
    updatedAt: "STUDENT_LAST_UPDATE",
  }
);

//foreignkeys

export default Student;
