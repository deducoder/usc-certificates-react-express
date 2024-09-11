import { DataTypes } from "sequelize";
import db from "../database/connection";
//importing other models
import User from "./user";

const Admin = db.define(
  "Administrator",
  {
    ADMIN_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ADMIN_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ADMIN_PA_LAST_NAME: {
      type: DataTypes.STRING,
    },
    ADMIN_MA_LAST_NAME: {
      type: DataTypes.STRING,
    },
    USER_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        //foreignkey references to users table
        model: User,
        key: "USER_ID",
      },
    },
    ADMIN_STATUS: {
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
      beforeSave: (admin: any) => {
        if (admin.ADMIN_NAME) {
          admin.ADMIN_NAME = admin.ADMIN_NAME.toUpperCase();
        }
        if (admin.ADMIN_PA_LAST_NAME) {
          admin.ADMIN_PA_LAST_NAME = admin.ADMIN_PA_LAST_NAME.toUpperCase();
        }
        if (admin.ADMIN_MA_LAST_NAME) {
          admin.ADMIN_MA_LAST_NAME = admin.ADMIN_MA_LAST_NAME.toUpperCase();
        }
      },
    },
    tableName: "ADMINISTRATORS",
    createdAt: "ADMIN_CREATION",
    updatedAt: "ADMIN_LAST_UPDATE",
  }
);

//foreignkeys
Admin.belongsTo(User, {
  foreignKey: "USER_ID",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Admin, {
  foreignKey: "USER_ID",
});

export default Admin;
