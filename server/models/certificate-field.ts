import { DataTypes } from "sequelize";
import db from "../database/connection";

const CertificateField = db.define(
  "Certificate",
  {
    FIELD_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    FIELD_NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    FIELD_VALUE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeSave: (field: any) => {
        if (field.FIELD_NAME) {
          field.FIELD_NAME = field.FIELD_NAME.toUpperCase();
        }
        if (field.FIELD_VALUE) {
          field.FIELD_VALUE = field.FIELD_VALUE.toUpperCase();
        }
      },
    },
    tableName: "CERTIFICATE_FIELDS",
    timestamps: false,
  }
);

export default CertificateField;
