import { DataTypes, DATE, DATEONLY } from "sequelize";
import db from "../database/connection";
import Student from "./student";
import Career from "./career";

const StudentCareer = db.define(
  "StudentCareer",
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    STUDENT_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        //foreignkey references to students table
        model: Student,
        key: "STUDENT_ID",
      },
    },
    CAREER_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        //foreignkey references to students table
        model: Career,
        key: "CAREER_ID",
      },
    },
    START_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    END_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    RELATION_STATUS: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
      validate: {
        isIn: [[0, 1]],
      },
    },
  },
  {
    tableName: "STUDENTS_CAREERS",
    createdAt: "CREATION",
    updatedAt: "LAST_UPDATE",
  }
);

//foreignkeys
StudentCareer.belongsTo(Student, {
  foreignKey: "STUDENT_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

StudentCareer.belongsTo(Career, {
  foreignKey: "CAREER_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Establecer asociaciones inversas en Student y Career
Student.hasMany(StudentCareer, {
  foreignKey: "STUDENT_ID",
});

Career.hasMany(StudentCareer, {
  foreignKey: "CAREER_ID",
});

export default StudentCareer;
