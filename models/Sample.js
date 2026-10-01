const { DataTypes } = require("../config/packages");
const { sequelize } = require("../config/sequelize");
const { models } = require("../config/models");
const { STATUS_TYPES } = require("../config/constants");

let Sample = null;

if (sequelize) {
  Sample = sequelize.define(
    "Sample",
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: STATUS_TYPES.ACTIVE,
      },
      ...models.defaultAttributes,
    },
    {
      tableName: "sample",
      freezeTableName: true,
      timestamps: false,
    }
  );

  Sample.associate = (_models) => {
    // Define associations here, e.g. Sample.hasMany(models.OtherModel)
  };
}

module.exports = Sample;
