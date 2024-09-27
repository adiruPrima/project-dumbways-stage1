"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    static associate(models) {
      // Specify the foreign key as 'user_id'
      this.belongsTo(models.user, { foreignKey: "user_id" });
    }
  }
  project.init(
    {
      title: DataTypes.STRING,
      start_date: DataTypes.STRING,
      end_date: DataTypes.STRING,
      duration: DataTypes.STRING,
      description: DataTypes.TEXT,
      technologies: DataTypes.ARRAY(DataTypes.STRING),
      image: DataTypes.STRING,
      user_id: DataTypes.INTEGER, // Make sure this is consistent with your DB
    },
    {
      sequelize,
      modelName: "project",
    }
  );
  return project;
};
